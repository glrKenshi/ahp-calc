// AhpRunner.js
import AHP from 'ahp';

export function runAHP({ items, criteria, criteriaComparisons, itemComparisons }) {
  try {
    // Проверка входных данных
    if (!items || items.length < 2) {
      throw new Error('Недостаточно альтернатив для анализа (минимум 2)');
    }
    
    if (!criteria || criteria.length < 1) {
      throw new Error('Не указаны критерии для анализа');
    }

    // Создаем новый экземпляр AHP
    const ahpContext = new AHP();

    // Добавляем альтернативы
    ahpContext.addItems(items);

    // Добавляем критерии
    ahpContext.addCriteria(criteria);

    // Преобразуем сравнения критериев в нужный формат
    const formattedCriteriaComparisons = criteriaComparisons.map(([a, b, value]) => {
      return [a.toString(), b.toString(), Number(value)];
    });

    // Добавляем сравнения критериев
    ahpContext.rankCriteria(formattedCriteriaComparisons);

    // Обрабатываем сравнения для каждого критерия
    const formattedItemComparisons = {};
    for (const criterion of criteria) {
      if (!itemComparisons[criterion] || itemComparisons[criterion].length === 0) {
        throw new Error(`Не выполнены сравнения альтернатив для критерия "${criterion}"`);
      }

      formattedItemComparisons[criterion] = itemComparisons[criterion].map(([a, b, value]) => {
        return [a.toString(), b.toString(), Number(value)];
      });
      
      ahpContext.rankItems(criterion.toString(), formattedItemComparisons[criterion]);
    }

    // Выполняем анализ
    const result = ahpContext.run();

    // Проверяем согласованность
    if (result.consistencyRatio > 0.1) {
      console.warn(`Внимание: коэффициент согласованности (${result.consistencyRatio.toFixed(2)}) превышает 0.1. Результаты могут быть ненадежными.`);
    }

    return {
      rankedScores: result.rankedScores,
      consistencyRatio: result.consistencyRatio
    };
  } catch (error) {
    console.error('Ошибка в AHP расчетах:', error);
    return null;
  }
}