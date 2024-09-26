import React from 'react';
import { Card, Statistic, Tag, Typography, Popover } from 'antd';


const { Text } = Typography;

const Statistics = ({data, statisticFilter}) => {

    const popoverContent = (
        <Card style={{cursor: 'default'}}>
            <Card.Grid onClick={() => statisticFilter([4])} style={{textAlign: 'center', width: '50%', backgroundColor: 'rgba(136, 214, 108, 0.8)'}}><Statistic title="Tamamlanan" value={data.completeCount} /></Card.Grid>
            <Card.Grid onClick={() => statisticFilter([3])} style={{textAlign: 'center', width: '50%', backgroundColor: 'rgba(0, 141, 218, 0.8)'}}><Statistic title="İşlemde" value={data.processCount} /></Card.Grid>
            <Card.Grid onClick={() => statisticFilter([2])} style={{textAlign: 'center', width: '50%', backgroundColor: 'rgba(255, 234, 32, 0.8)'}}><Statistic title="Beklemede" value={data.pendingCount} /></Card.Grid>
            <Card.Grid onClick={() => statisticFilter([1])} style={{textAlign: 'center', width: '50%', backgroundColor: 'rgba(249, 74, 41, 0.8)'}}><Statistic title="Ertelendi" value={data.postponedCount} /></Card.Grid>
            <Card.Grid onClick={() => statisticFilter([1,2,3,4])} style={{textAlign: 'center', width: '100%', backgroundColor: 'rgba(190, 210, 210, 0.8)'}}><Statistic title="Toplam" value={data.totalTask} /></Card.Grid>
        </Card>
    );

    return (
        <>
            <Popover placement="bottom" content={popoverContent}>
              <Tag className='statistic' color='#3F72AF' style={{display: 'flex', alignContent: 'center', cursor: 'default'}}>
                <Tag onClick={() => statisticFilter([4])} bordered={false} style={{borderColor: 'white', width: '30px', height: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center'}} color='rgba(136, 214, 108, 0.8)'><Text strong style={{color: 'white'}}>{data.completeCount}</Text></Tag>
                <Tag bordered={false} color='#3F72AF'><Text strong></Text></Tag>
                <Tag onClick={() => statisticFilter([3])} bordered={false} style={{borderColor: 'white', width: '30px', height: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center'}} color='rgba(0, 141, 218, 0.8)'><Text strong style={{color: 'white'}}>{data.processCount}</Text></Tag>
                <Tag bordered={false} color='#3F72AF'><Text strong></Text></Tag>
                <Tag onClick={() => statisticFilter([2])} bordered={false} style={{borderColor: 'white', width: '30px', height: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center'}} color='rgba(255, 234, 32, 0.8)'><Text strong style={{color: 'white'}}>{data.pendingCount}</Text></Tag>
                <Tag bordered={false} color='#3F72AF'><Text strong></Text></Tag>
                <Tag onClick={() => statisticFilter([1])} bordered={false} style={{borderColor: 'white', width: '30px', height: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center'}} color='rgba(249, 74, 41, 0.8)'><Text strong style={{color: 'white'}}>{data.postponedCount}</Text></Tag>
              </Tag>
            </Popover>
        </>
    );
};

export default Statistics;