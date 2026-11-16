import { useState } from 'react';
import { IconClose } from '../../../Shared/Components/Icons';
import '../Styles/search.scss';

export const PunjabiKeyboard = ({ onKeyPress, onBackspace, onClear, onClose }) => {
  // Default to 'letters' so initially only the 35 core letters are shown
  const [activeTab, setActiveTab] = useState('letters'); // 'letters', 'matras', 'bindi', 'all'

  // Standard 35 Akhar organized in 7 rows of 5
  const coreRows = [
    ['ੳ', 'ਅ', 'ੲ', 'ਸ', 'ਹ'],
    ['ਕ', 'ਖ', 'ਗ', 'ਘ', 'ਙ'],
    ['ਚ', 'ਛ', 'ਜ', 'ਝ', 'ਞ'],
    ['ਟ', 'ਠ', 'ਡ', 'ਢ', 'ਣ'],
    ['ਤ', 'ਥ', 'ਦ', 'ਧ', 'ਨ'],
    ['ਪ', 'ਫ', 'ਬ', 'ਭ', 'ਮ'],
    ['ਯ', 'ਰ', 'ਲ', 'ਵ', 'ੜ'],
  ];

  // Pair bindi characters
  const pairBindi = ['ਸ਼', 'ਖ਼', 'ਗ਼', 'ਜ਼', 'ਫ਼', 'ਲ਼'];

  // Laga-Matras and sacred symbols
  const matras = ['ਾ', 'ਿ', 'ੀ', 'ੁ', 'ੂ', 'ੇ', 'ੈ', 'ੋ', 'ੌ', 'ੰ', 'ੱ', '਼', 'ੴ', '॥'];

  return (
    <div className="panel punjabi-keyboard-panel">
      {/* Keyboard Header */}
      <div className="punjabi-keyboard-header">
        <div className="punjabi-keyboard-title-group">
          <span className="punjabi-keyboard-title">
            ਗੁਰਮੁਖੀ ਕੀਬੋਰਡ
          </span>
          <span className="punjabi-keyboard-tab-label">
            {activeTab === 'letters' && '— ਮੁੱਖ ਅੱਖਰ'}
            {activeTab === 'matras' && '— ਲਗਾਂ ਮਾਤਰਾਵਾਂ'}
            {activeTab === 'bindi' && '— ਪੈਰ ਬਿੰਦੀ'}
            {activeTab === 'all' && '— ਸਭ'}
          </span>
        </div>

        <div className="punjabi-keyboard-tabs">
          {/* Category Filter Pills */}
          <button
            type="button"
            onClick={() => setActiveTab('letters')}
            className={`btn btn-sm ${activeTab === 'letters' ? 'btn-primary' : 'btn-ghost'} punjabi-keyboard-tab-btn`}
          >
            ਮੁੱਖ ਅੱਖਰ (35)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('matras')}
            className={`btn btn-sm ${activeTab === 'matras' ? 'btn-primary' : 'btn-ghost'} punjabi-keyboard-tab-btn`}
          >
            ਮਾਤਰਾਵਾਂ (Matras)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bindi')}
            className={`btn btn-sm ${activeTab === 'bindi' ? 'btn-primary' : 'btn-ghost'} punjabi-keyboard-tab-btn`}
          >
            ਪੈਰ ਬਿੰਦੀ
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-ghost'} punjabi-keyboard-tab-btn`}
            title="ਸਾਰੇ ਅੱਖਰ ਅਤੇ ਮਾਤਰਾਵਾਂ ਇਕੱਠੇ ਦੇਖੋ"
          >
            ਸਭ (All)
          </button>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="btn btn-icon btn-ghost btn-sm"
            style={{ marginLeft: '0.25rem' }}
            title="Close Punjabi Keyboard"
            aria-label="Close Punjabi Keyboard"
          >
            <IconClose size={16} />
          </button>
        </div>
      </div>

      {/* Keys Layout Container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {/* Core 35 Akhar */}
        {(activeTab === 'letters' || activeTab === 'all') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {coreRows.map((row, rIdx) => (
              <div key={rIdx} className="punjabi-keyboard-grid-5">
                {row.map((char) => (
                  <button
                    key={char}
                    type="button"
                    onClick={() => onKeyPress(char)}
                    className="punjabi-keyboard-key"
                  >
                    {char}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Pair Bindi Letters */}
        {(activeTab === 'bindi' || activeTab === 'all') && (
          <div style={{ marginTop: activeTab === 'all' ? '6px' : '0' }}>
            {activeTab === 'all' && (
              <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)', marginBottom: '4px', fontWeight: 600 }}>
                ਪੈਰ ਬਿੰਦੀ ਅੱਖਰ:
              </div>
            )}
            <div className="punjabi-keyboard-grid-6">
              {pairBindi.map((char) => (
                <button
                  key={char}
                  type="button"
                  onClick={() => onKeyPress(char)}
                  className="punjabi-keyboard-key"
                >
                  {char}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Laga-Matras and Sacred Signs */}
        {(activeTab === 'matras' || activeTab === 'all') && (
          <div style={{ marginTop: activeTab === 'all' ? '6px' : '0' }}>
            {activeTab === 'all' && (
              <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)', marginBottom: '4px', fontWeight: 600 }}>
                ਲਗਾਂ ਮਾਤਰਾਵਾਂ:
              </div>
            )}
            <div className="punjabi-keyboard-grid-7">
              {matras.map((char) => (
                <button
                  key={char}
                  type="button"
                  onClick={() => onKeyPress(char)}
                  className="punjabi-keyboard-key matra-key"
                >
                  {char}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Bottom Bar */}
        <div className="punjabi-keyboard-bottom-bar">
          {/* Quick tab switch key for fast mobile/touch typing */}
          <button
            type="button"
            onClick={() => setActiveTab((prev) => (prev === 'letters' ? 'matras' : 'letters'))}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.5rem', fontWeight: 600 }}
            title="Switch between Letters and Matras"
          >
            {activeTab === 'letters' ? 'ਾ ਿ ੀ ਮਾਤਰਾ' : 'ੳ ਅ ੲ ਅੱਖਰ'}
          </button>

          <button
            type="button"
            onClick={() => onKeyPress(' ')}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.82rem', padding: '0.4rem', fontWeight: 600 }}
          >
            ਖਾਲੀ ਥਾਂ (Space)
          </button>
          <button
            type="button"
            onClick={onBackspace}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.5rem', fontWeight: 600 }}
          >
            ⌫ ਮਿਟਾਓ
          </button>
          <button
            type="button"
            onClick={onClear}
            className="btn btn-ghost btn-sm"
            style={{ fontSize: '0.78rem', color: 'var(--color-error)' }}
          >
            ਸਾਫ਼ ਕਰੋ
          </button>
        </div>
      </div>
    </div>
  );
};

export default PunjabiKeyboard;
