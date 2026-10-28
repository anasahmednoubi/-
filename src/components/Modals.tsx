import React, { useState, useEffect, useRef } from 'react';
import { Task, Routine } from '../types';
import { t } from '../translations';
import { IconPicker } from './IconPicker';
import { Icon } from '../icons';
import { ORDER, getDayName } from '../utils';

export type ActiveModal =
  | { type: 'editTask'; task: Task }
  | { type: 'editRoutine'; routine: Routine }
  | { type: 'confirmDelTask'; task: Task }
  | { type: 'confirmDelRoutine'; routine: Routine }
  | { type: 'logAmount'; task: Task }
  | { type: 'confirmWipe' }
  | null;

interface ModalsProps {
  activeModal: ActiveModal;
  onClose: () => void;
  onSaveTask: (updated: Task) => void;
  onSaveRoutine: (updated: Routine) => void;
  onDeleteTask: (id: number) => void;
  onDeleteRoutine: (id: number) => void;
  onConfirmAmount: (taskId: number, amount: number) => void;
  onConfirmWipe: () => void;
  lang: 'ar' | 'en';
}

export const Modals: React.FC<ModalsProps> = ({
  activeModal,
  onClose,
  onSaveTask,
  onSaveRoutine,
  onDeleteTask,
  onDeleteRoutine,
  onConfirmAmount,
  onConfirmWipe,
  lang,
}) => {
  const [currentModal, setCurrentModal] = useState<ActiveModal>(activeModal);
  const [isClosing, setIsClosing] = useState(false);
  const closingTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (activeModal) {
      if (closingTimeoutRef.current) {
        clearTimeout(closingTimeoutRef.current);
        closingTimeoutRef.current = null;
      }
      setCurrentModal(activeModal);
      setIsClosing(false);
    } else if (currentModal && !isClosing) {
      // Trigger exit animation before unmounting
      setIsClosing(true);
      closingTimeoutRef.current = window.setTimeout(() => {
        setCurrentModal(null);
        setIsClosing(false);
      }, 240);
    }
  }, [activeModal, currentModal, isClosing]);

  const requestClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    closingTimeoutRef.current = window.setTimeout(() => {
      onClose();
      setCurrentModal(null);
      setIsClosing(false);
    }, 240);
  };

  if (!currentModal) return null;

  const modalClass = isClosing ? 'm-exit' : 'm-enter';
  const sheetClass = isClosing ? 's-exit' : 's-enter';

  return (
    <div
      id="modal"
      className={modalClass}
      onClick={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
    >
      {currentModal.type === 'editTask' && (
        <EditTaskSheet
          task={currentModal.task}
          sheetClass={sheetClass}
          onClose={requestClose}
          onSave={(t) => {
            onSaveTask(t);
            requestClose();
          }}
          onDelete={(id) => {
            onDeleteTask(id);
            requestClose();
          }}
          lang={lang}
        />
      )}
      {currentModal.type === 'editRoutine' && (
        <EditRoutineSheet
          routine={currentModal.routine}
          sheetClass={sheetClass}
          onClose={requestClose}
          onSave={(r) => {
            onSaveRoutine(r);
            requestClose();
          }}
          onDelete={(id) => {
            onDeleteRoutine(id);
            requestClose();
          }}
          lang={lang}
        />
      )}
      {currentModal.type === 'confirmDelTask' && (
        <div className={`sheet ${sheetClass}`}>
          <b>
            {t('هل تريد حذف', lang)} {t('المهمة', lang)} &ldquo;{currentModal.task.name}&rdquo;{t('؟', lang)}
          </b>
          <div className="sub" style={{ marginTop: '4px' }}>
            {t('لا يمكن التراجع عن هذا الإجراء.', lang)}
          </div>
          <div className="row" style={{ marginTop: '12px' }}>
            <button
              style={{ background: '#d33' }}
              onClick={() => {
                onDeleteTask(currentModal.task.id);
                requestClose();
              }}
            >
              {t('نعم، احذف', lang)}
            </button>
            <button className="ghost" onClick={requestClose}>
              {t('إلغاء', lang)}
            </button>
          </div>
        </div>
      )}
      {currentModal.type === 'confirmDelRoutine' && (
        <div className={`sheet ${sheetClass}`}>
          <b>
            {t('هل تريد حذف', lang)} {t('الروتين', lang)} &ldquo;{currentModal.routine.name}&rdquo;{t('؟', lang)}
          </b>
          <div className="sub" style={{ marginTop: '4px' }}>
            {t('لا يمكن التراجع عن هذا الإجراء.', lang)}
          </div>
          <div className="row" style={{ marginTop: '12px' }}>
            <button
              style={{ background: '#d33' }}
              onClick={() => {
                onDeleteRoutine(currentModal.routine.id);
                requestClose();
              }}
            >
              {t('نعم، احذف', lang)}
            </button>
            <button className="ghost" onClick={requestClose}>
              {t('إلغاء', lang)}
            </button>
          </div>
        </div>
      )}
      {currentModal.type === 'logAmount' && (
        <LogAmountSheet
          task={currentModal.task}
          sheetClass={sheetClass}
          onClose={requestClose}
          onConfirm={(amt) => {
            onConfirmAmount(currentModal.task.id, amt);
            requestClose();
          }}
          lang={lang}
        />
      )}
      {currentModal.type === 'confirmWipe' && (
        <div className={`sheet ${sheetClass}`}>
          <b>{t('هل تريد مسح جميع البيانات؟', lang)}</b>
          <div className="sub" style={{ marginTop: '4px' }}>
            {t('ستُمسح جميع المهام والروتينات ولا يمكن استرجاعها.', lang)}
          </div>
          <div className="row" style={{ marginTop: '12px' }}>
            <button
              style={{ background: '#d33' }}
              onClick={() => {
                onConfirmWipe();
                requestClose();
              }}
            >
              {t('نعم، امسح', lang)}
            </button>
            <button className="ghost" onClick={requestClose}>
              {t('إلغاء', lang)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const EditTaskSheet: React.FC<{
  task: Task;
  sheetClass: string;
  onClose: () => void;
  onSave: (t: Task) => void;
  onDelete: (id: number) => void;
  lang: 'ar' | 'en';
}> = ({ task, sheetClass, onClose, onSave, onDelete, lang }) => {
  const [name, setName] = useState(task.name);
  const [icon, setIcon] = useState(task.icon || 'i:pin');
  const [target, setTarget] = useState(String(task.target));
  const [unit, setUnit] = useState(task.unit);
  const [daily, setDaily] = useState(String(task.daily || 0));
  const [done, setDone] = useState(String(task.done || 0));

  const handleSave = () => {
    const tg = parseFloat(target);
    const dn = parseFloat(done);
    if (!name.trim() || !(tg > 0) || !(dn >= 0)) return;
    const isFinished = dn >= tg;
    onSave({
      ...task,
      name: name.trim(),
      icon,
      target: tg,
      unit: unit.trim(),
      daily: parseFloat(daily) || 0,
      done: Math.min(tg, dn),
      finished: isFinished,
    });
  };

  return (
    <div className={`sheet ${sheetClass}`}>
      <b>{t('تعديل المهمة', lang)}</b>
      <div className="row" style={{ marginTop: '10px' }}>
        <IconPicker selectedIcon={icon} onSelectIcon={setIcon} lang={lang} />
        <input
          className="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('اسم المهمة (مثلًا: مذاكرة)', lang)}
        />
        <label>
          {t('الكمية', lang)}
          <input
            type="number"
            min="1"
            inputMode="numeric"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
        </label>
        <label>
          {t('الوحدة', lang)}
          <input
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder={t('الوحدة (صفحة…)', lang)}
          />
        </label>
        <label>
          {t('كمية اليوم', lang)}
          <input
            type="number"
            min="0"
            inputMode="numeric"
            value={daily}
            onChange={(e) => setDaily(e.target.value)}
          />
        </label>
        <label>
          {t('المنجز', lang)}
          <input
            type="number"
            min="0"
            inputMode="numeric"
            value={done}
            onChange={(e) => setDone(e.target.value)}
          />
        </label>
        <button className="esm esv" onClick={handleSave}>
          {t('حفظ', lang)}
        </button>
        <button className="ghost esm" onClick={onClose}>
          {t('إلغاء', lang)}
        </button>
        <button
          className="ghost esm"
          style={{ color: '#d33', marginInlineStart: 'auto' }}
          onClick={() => onDelete(task.id)}
        >
          <Icon name="i:trash" size="16px" /> {t('حذف', lang)}
        </button>
      </div>
    </div>
  );
};

const EditRoutineSheet: React.FC<{
  routine: Routine;
  sheetClass: string;
  onClose: () => void;
  onSave: (r: Routine) => void;
  onDelete: (id: number) => void;
  lang: 'ar' | 'en';
}> = ({ routine, sheetClass, onClose, onSave, onDelete, lang }) => {
  const [name, setName] = useState(routine.name);
  const [icon, setIcon] = useState(routine.icon || 'i:repeat');
  const [mode, setMode] = useState<'W' | 'M'>(routine.mode || 'W');
  const [days, setDays] = useState<number[]>(routine.days ? routine.days.slice() : []);
  const [md, setMd] = useState<number[]>(routine.md ? routine.md.slice() : []);

  const toggleDay = (d: number) => {
    setDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  };

  const toggleAllDays = () => {
    setDays((prev) => (prev.length === 7 ? [] : [0, 1, 2, 3, 4, 5, 6]));
  };

  const toggleMonthDay = (n: number) => {
    setMd((prev) =>
      prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]
    );
  };

  const handleSave = () => {
    if (!name.trim()) return;
    if (mode === 'M' && md.length === 0) return;
    if (mode === 'W' && days.length === 0) return;
    onSave({
      ...routine,
      name: name.trim(),
      icon,
      mode,
      days: days.slice(),
      md: md.slice(),
    });
  };

  return (
    <div className={`sheet ${sheetClass}`}>
      <b>{t('تعديل الروتين', lang)}</b>
      <div className="row" style={{ marginTop: '10px' }}>
        <IconPicker selectedIcon={icon} onSelectIcon={setIcon} lang={lang} />
        <input
          className="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('اسم الروتين (مثلًا: رياضة)', lang)}
        />
        <div className="chips">
          <div className={`seg ${mode === 'M' ? 'm' : ''}`}>
            <span className="ind" />
            <button
              type="button"
              className={`chip ${mode === 'W' ? 'on' : ''}`}
              onClick={() => setMode('W')}
            >
              {t('كل أسبوع', lang)}
            </button>
            <button
              type="button"
              className={`chip ${mode === 'M' ? 'on' : ''}`}
              onClick={() => setMode('M')}
            >
              {t('كل شهر', lang)}
            </button>
          </div>
          <div className="pane in" style={{ flex: '1 1 100%' }}>
            {mode === 'W' ? (
              <div className="dgrid g4">
                <button
                  type="button"
                  className={`chip ${days.length === 7 ? 'on' : ''}`}
                  onClick={toggleAllDays}
                >
                  {t('كل يوم', lang)}
                </button>
                {ORDER.map((d) => (
                  <button
                    key={d}
                    type="button"
                    className={`chip ${days.includes(d) ? 'on' : ''}`}
                    onClick={() => toggleDay(d)}
                  >
                    {getDayName(d, lang)}
                  </button>
                ))}
              </div>
            ) : (
              <div className="dgrid g7">
                {Array.from({ length: 31 }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`chip ${md.includes(n) ? 'on' : ''}`}
                    onClick={() => toggleMonthDay(n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <button className="esm esv" onClick={handleSave}>
          {t('حفظ', lang)}
        </button>
        <button className="ghost esm" onClick={onClose}>
          {t('إلغاء', lang)}
        </button>
        <button
          className="ghost esm"
          style={{ color: '#d33', marginInlineStart: 'auto' }}
          onClick={() => onDelete(routine.id)}
        >
          <Icon name="i:trash" size="16px" /> {t('حذف', lang)}
        </button>
      </div>
    </div>
  );
};

const LogAmountSheet: React.FC<{
  task: Task;
  sheetClass: string;
  onClose: () => void;
  onConfirm: (amt: number) => void;
  lang: 'ar' | 'en';
}> = ({ task, sheetClass, onClose, onConfirm, lang }) => {
  const rem = Math.max(0, task.target - task.done);
  const defaultVal = task.daily > 0 ? Math.min(task.daily, rem) : '';
  const [val, setVal] = useState(String(defaultVal));

  const handleConfirm = () => {
    const v = parseFloat(val);
    if (v > 0) {
      onConfirm(v);
    }
  };

  return (
    <div className={`sheet ${sheetClass}`}>
      <b>{t('كم أنجزت اليوم؟', lang)}</b>
      <div className="sub" style={{ marginTop: '4px' }}>
        <Icon name={task.icon || 'i:pin'} /> {task.name} &mdash;{' '}
        {t('المتبقي', lang)} {rem} {task.unit}
      </div>
      <div className="row" style={{ marginTop: '10px' }}>
        <input
          className="name"
          type="number"
          min="1"
          inputMode="numeric"
          autoFocus
          placeholder={`${t('العدد الذي أنجزته', lang)} ${task.unit}`}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleConfirm();
          }}
        />
        <button onClick={handleConfirm}>{t('تسجيل', lang)}</button>
        <button className="ghost" onClick={onClose}>
          {t('إلغاء', lang)}
        </button>
      </div>
    </div>
  );
};
