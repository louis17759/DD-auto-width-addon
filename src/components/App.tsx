/*global Dingdocs*/

import { useEffect, useState } from 'react';
import { initView } from 'dingtalk-docs-cool-app';
import { Typography, Button, Card, Radio, Space, message } from 'dingtalk-design-desktop';
import { getLocale, type Locales } from './locales';
import './style.css';

function App() {
  const [locale, setLocale] = useState<Locales>(getLocale('zh-CN'));
  const [loadingType, setLoadingType] = useState<string>(''); // 'content', 'header', 'fixed-100', 'fixed-200', 'fixed-300', 'fixed-custom'
  const [applyScope, setApplyScope] = useState<string>('current'); // 'current', 'currentSheet', 'allSheets'
  const [customWidth, setCustomWidth] = useState<string>('');



  useEffect(() => {
    initView({
      onReady: async () => {
        // 获取当前语言设置
        try {
          const currentLocale = await Dingdocs.base.host.getLocale();
          setLocale(getLocale(currentLocale));
        } catch (e) {
          console.warn('Failed to get locale, using default zh-CN');
        }
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 按内容调整列宽
  const handleAdjustByContent = async () => {
    setLoadingType('content');
    try {
      const result = await Dingdocs.script.run('adjustColumnWidthByContent', applyScope);
      message.success(`${locale.adjustColumnWidthSuccess}（${result.viewsCount} 个视图，${result.sheetsCount} 张表）`);
    } catch (error: any) {
      message.error(`${locale.adjustColumnWidthFailed}: ${error.message}`);
    } finally {
      setLoadingType('');
    }
  };

  // 按表头调整列宽
  const handleAdjustByHeader = async () => {
    setLoadingType('header');
    try {
      const result = await Dingdocs.script.run('adjustColumnWidthByHeader', applyScope);
      message.success(`${locale.adjustColumnWidthSuccess}（${result.viewsCount} 个视图，${result.sheetsCount} 张表）`);
    } catch (error: any) {
      message.error(`${locale.adjustColumnWidthFailed}: ${error.message}`);
    } finally {
      setLoadingType('');
    }
  };

  // 按固定值调整列宽
  const handleAdjustByFixedValue = async (width: number, type: string) => {
    setLoadingType(type);
    try {
      const result = await Dingdocs.script.run('adjustColumnWidthByFixedValue', width, applyScope);
      message.success(`${locale.adjustColumnWidthSuccess}（${result.viewsCount} 个视图，${result.sheetsCount} 张表）`);
    } catch (error: any) {
      message.error(`${locale.adjustColumnWidthFailed}: ${error.message}`);
    } finally {
      setLoadingType('');
    }
  };

  // 应用自定义宽度
  const handleApplyCustomWidth = () => {
    if (!customWidth || customWidth.trim() === '') {
      message.warning(locale.enterCustomWidth);
      return;
    }
    const widthNum = parseInt(customWidth);
    if (isNaN(widthNum) || widthNum < 100 || widthNum > 1000) {
      message.error(locale.widthMustBeBetween);
      return;
    }
    handleAdjustByFixedValue(widthNum, 'fixed-custom');
  };

  return (
    <div className='page'>
      <div className='header'>
        <Typography.Text strong>✨ {locale.columnWidthAdjustment}</Typography.Text>
      </div>
      
      <div className='content'>
        <Card size='small' style={{marginBottom: 16}}>
          {/* 应用范围选择 */}
          <div style={{marginBottom: 16}}>
            <Typography.Text strong style={{display: 'block', marginBottom: 8}}>
              应用范围
            </Typography.Text>
            <Radio.Group 
              value={applyScope} 
              onChange={(e) => setApplyScope(e.target.value)}
            >
              <Space direction='vertical'>
                <Radio value='current'>{locale.applyToCurrentView}</Radio>
                <Radio value='currentSheet'>{locale.applyToCurrentSheet}</Radio>
                <Radio value='allSheets'>{locale.applyToAllSheets}</Radio>
              </Space>
            </Radio.Group>
          </div>

          {/* 调整方式 */}
          <div>
            <Typography.Text strong style={{display: 'block', marginBottom: 8}}>
              调整方式
            </Typography.Text>
            <Space style={{width: '100%'}} direction='vertical' size='middle'>
              {/* 按内容调整 */}
              <Button 
                type='primary' 
                block 
                onClick={handleAdjustByContent}
                loading={loadingType === 'content'}
                disabled={loadingType !== '' && loadingType !== 'content'}
                icon={<span>📝</span>}
              >
                {locale.adjustByContent}
              </Button>

              {/* 按表头调整 */}
              <Button 
                type='primary'
                block 
                onClick={handleAdjustByHeader}
                loading={loadingType === 'header'}
                disabled={loadingType !== '' && loadingType !== 'header'}
                icon={<span>📋</span>}
              >
                {locale.adjustByHeader}
              </Button>

              {/* 按固定值调整 */}
              <div>
                <Typography.Text strong style={{display: 'block', marginBottom: 8, fontSize: 14}}>
                  {locale.adjustByFixedValue}
                </Typography.Text>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: 12}}>
                  <Button 
                    type='primary'
                    onClick={() => handleAdjustByFixedValue(100, 'fixed-100')}
                    loading={loadingType === 'fixed-100'}
                    disabled={loadingType !== '' && loadingType !== 'fixed-100'}
                  >
                    {locale.fixedWidth100}
                  </Button>
                  <Button 
                    type='primary'
                    onClick={() => handleAdjustByFixedValue(200, 'fixed-200')}
                    loading={loadingType === 'fixed-200'}
                    disabled={loadingType !== '' && loadingType !== 'fixed-200'}
                  >
                    {locale.fixedWidth200}
                  </Button>
                  <Button 
                    type='primary'
                    onClick={() => handleAdjustByFixedValue(300, 'fixed-300')}
                    loading={loadingType === 'fixed-300'}
                    disabled={loadingType !== '' && loadingType !== 'fixed-300'}
                  >
                    {locale.fixedWidth300}
                  </Button>
                </div>
                
                {/* 自定义宽度输入 - 始终显示 */}
                <div style={{padding: 12, backgroundColor: '#f5f5f5', borderRadius: 4}}>
                  <Typography.Text type='secondary' style={{fontSize: 12, display: 'block', marginBottom: 8}}>
                    {locale.enterCustomWidth}
                  </Typography.Text>
                  <Space style={{width: '100%'}}>
                    <input
                      type='number'
                      value={customWidth}
                      onChange={(e) => setCustomWidth(e.target.value)}
                      placeholder='150'
                      min='100'
                      max='1000'
                      style={{
                        flex: 1,
                        padding: '4px 8px',
                        border: '1px solid #d9d9d9',
                        borderRadius: 2,
                        fontSize: 14,
                        width: '120px'
                      }}
                    />
                    <Button 
                      type='primary'
                      size='small'
                      onClick={handleApplyCustomWidth}
                      loading={loadingType === 'fixed-custom'}
                      disabled={loadingType !== '' && loadingType !== 'fixed-custom'}
                    >
                      {locale.confirm}
                    </Button>
                  </Space>
                </div>
              </div>
            </Space>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default App;
