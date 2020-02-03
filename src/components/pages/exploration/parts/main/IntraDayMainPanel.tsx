import React from 'react';
import { ExplorationInfo, ParameterType, IntraDayDataSourceType } from "../../../../../core/exploration/types";
import { explorationInfoHelper } from "../../../../../core/exploration/ExplorationInfoHelper";
import { StepIntraDayPanel } from "./intraday/StepIntraDayPanal";
import { HeartRateIntraDayPanel } from './intraday/HeartRateIntraDayPanel';
import { SleepIntraDayPanel } from './intraday/SleepIntraDayPanel';

export function getIntraDayMainPanel(info: ExplorationInfo): any{
    const intraDaySourceType = explorationInfoHelper.getParameterValue(info, ParameterType.IntraDayDataSource)

    switch(intraDaySourceType){
        case IntraDayDataSourceType.StepCount:
            return <StepIntraDayPanel/>
        case IntraDayDataSourceType.HeartRate:
            return <HeartRateIntraDayPanel/>
        case IntraDayDataSourceType.Sleep:
            return <SleepIntraDayPanel/>
    }
}