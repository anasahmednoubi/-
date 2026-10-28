import React, { useState } from 'react';
import { Task } from '../types';
import { t } from '../translations';
import { Icon } from '../icons';
import { IconPicker } from './IconPicker';
import { pct, col, key, today } from '../utils';

interface TasksViewProps {
  tasks: Task[];
  onAddTask: (newTask: Omit<Task, 'id' | 'done' | 'finished'>) => void;
  onAddAmount: (id: number, amount: number) => void;
  onFinishTask: (id: number) => void;
  onDoneTask: (task: Task) => void;
  onOpenEdit: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  lang: 'ar' | 'en';
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onAddTask,
  onAddAmount,
  onFinishTask,
  onDoneTask,
  onOpenEdit,
  onDeleteTask,
  lang,
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [icon, setIcon] = useState('i:pin');
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [unit, setUnit] = useState('');
  const [daily, setDaily] = useState('');
  const [search, setSearch] = useState('');
  const [amounts, setAmounts] = useState<Record<number, string>>({});

  const k = key(today());

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const tg = parseFloat(target);
    if (!name.trim() || !(tg > 0)) return;
    onAddTask({
      name: name.trim(),
      icon,
      target: tg,
      unit: unit.trim(),
      daily: parseFloat(daily) || 0,
    });
    setName('');
    setTarget('');
    setUnit('');
    setDaily('');
    setIsAddOpen(false);
  };

  const filteredTasks = tasks.filter((task) => {
    if (!search.trim()) return true;
    return task.name.toLowerCase().includes(search.trim().toLowerCase());
  });

  return (
    <div id="pT">
      <div
        className="addbar"
        onClick={() => setIsAddOpen(!isAddOpen)}
        role="button"
        tabIndex={0}
      >
        <button
          type="button"
          className={`plus ${isAddOpen ? 'on' : ''}`}
          aria-expanded={isAddOpen}
          aria-label={t('إضافة مهمة', lang)}
        >
          <Icon name="i:plus" size="24px" />
        </button>
        <span>{t('إضافة مهمة', lang)}</span>
      </div>

      <div className={`collapsible-drawer ${isAddOpen ? 'open' : ''}`}>
        <div className="collapsible-drawer-inner">
          <form className="add open" onSubmit={handleAdd}>
            <div className="row">
              <IconPicker
                selectedIcon={icon}
                onSelectIcon={setIcon}
                lang={lang}
              />
              <input
                className="name"
                placeholder={t('اسم المهمة (مثلًا: مذاكرة)', lang)}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="num"
                type="number"
                min="1"
                inputMode="numeric"
                placeholder={t('الكمية (مثلًا 20)', lang)}
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
              <input
                className="num"
                placeholder={t('الوحدة (صفحة…)', lang)}
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />
              <input
                className="num"
                type="number"
                min="0"
                inputMode="numeric"
                placeholder={t('كمية اليوم (مثلًا 5)', lang)}
                value={daily}
                onChange={(e) => setDaily(e.target.value)}
              />
              <button type="submit" id="addBtn">
                <Icon name="i:check" size="16px" />
                <span>{t('إضافة', lang)}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <input
        id="qT"
        type="search"
        autoComplete="off"
        placeholder={t('بحث في المهام…', lang)}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: '100%', boxSizing: 'border-box', margin: '0 0 12px' }}
      />

      <div id="list">
        {tasks.length === 0 ? (
          <div className="empty">
            {t('لا توجد مهام بعد. أضف أول مهمة من الأعلى.', lang)}
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="empty">{t('لا توجد نتائج مطابقة', lang)}</div>
        ) : (
          filteredTasks.map((task) => {
            const p = pct(task);
            const isTaskDone = task.finished || task.dk === k;
            return (
              <div
                key={task.id}
                className={`task ${task.finished ? 'done' : ''}`}
              >
                <div className="head">
                  <span
                    className="name-t"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <button
                      type="button"
                      className={`ck ${isTaskDone ? 'on' : ''}`}
                      onClick={() => onDoneTask(task)}
                      aria-label={t('تم', lang)}
                    >
                      {isTaskDone && <Icon name="i:check" size="16px" />}
                    </button>
                    <span
                      className={isTaskDone ? 'str' : ''}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <Icon name={task.icon || 'i:pin'} />
                      <span>{task.name}</span>
                    </span>
                  </span>
                  <span>
                    <button
                      type="button"
                      className="del dots"
                      onClick={() => onOpenEdit(task)}
                      aria-label={t('تعديل', lang)}
                    >
                      <Icon name="i:dots" size="20px" />
                    </button>
                    <button
                      type="button"
                      className="del"
                      onClick={() => onDeleteTask(task)}
                      aria-label={t('حذف', lang)}
                    >
                      <Icon name="i:x" />
                    </button>
                  </span>
                </div>

                <div className="bar">
                  <div
                    className="fill"
                    style={{
                      width: `${p}%`,
                      background: col(p),
                    }}
                  />
                </div>

                <div className="meta">
                  <span>
                    {task.done} / {task.target} {task.unit}
                  </span>
                  <span style={{ color: col(p), fontWeight: 600 }}>{p}%</span>
                </div>

                {task.dk === k && (
                  <div className="result" style={{ marginBottom: '8px' }}>
                    {t('إنجاز اليوم', lang)} +{task.dadd} {task.unit} &mdash;{' '}
                    {t('النسبة النهائية', lang)} {p}%
                  </div>
                )}

                {task.finished ? (
                  <div className="result">
                    {t('مبروك! أنجزت المهمة بالكامل', lang)}
                  </div>
                ) : (
                  <div className="row">
                    <input
                      className="num"
                      type="number"
                      min="1"
                      inputMode="numeric"
                      placeholder={t('كم أنجزت؟', lang)}
                      value={amounts[task.id] || ''}
                      onChange={(e) =>
                        setAmounts({ ...amounts, [task.id]: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const amt = parseFloat(amounts[task.id]);
                          if (amt > 0) {
                            onAddAmount(task.id, amt);
                            setAmounts({ ...amounts, [task.id]: '' });
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const amt = parseFloat(amounts[task.id]);
                        if (amt > 0) {
                          onAddAmount(task.id, amt);
                          setAmounts({ ...amounts, [task.id]: '' });
                        }
                      }}
                    >
                      {t('تسجيل', lang)}
                    </button>
                    <button
                      type="button"
                      className="ghost"
                      onClick={() => onFinishTask(task.id)}
                    >
                      {t('إنهاء', lang)}
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
