import React from "react";
import { View, Button, Text, Image, ImageBackground, ScrollView, SafeAreaView } from "react-native";
import { MeasureSpec } from "../../../../measure/MeasureSpec";
import { PropsWithNavigation } from "../../../../PropsWithNavigation";
import { Sizes } from "../../../../style/Sizes";
import { StyleTemplates } from "../../../../style/Styles";
import { createStackNavigator } from "react-navigation-stack";
import { DataSource, DataSourceMeasure } from "../../../../measure/source/DataSource";
import { sourceManager } from "../../../../system/SourceManager";
import { TouchableOpacity } from "react-native-gesture-handler";

interface Prop extends PropsWithNavigation {

}

interface State {
    measureSpec: MeasureSpec
}

export interface ServiceSelectionScreenParameters {
    measureSpec: MeasureSpec
    onServiceSelected: (selectedServiceMeasure: DataSourceMeasure) => void
}

export class ServiceSelectionScreen extends React.Component<Prop, State>{

    constructor(props) {
        super(props)

        this.state = {
            measureSpec: this.props.navigation.getParam("measureSpec")
        }
    }

    render() {
        return (
            <SafeAreaView style={{
                flex: 1, flexDirection: 'column', alignItems: 'stretch', marginTop: 120,
            }}>
                <Text style={{
                    ...StyleTemplates.titleTextStyle as any,
                    fontSize: Sizes.BigFontSize,
                    marginBottom: 24,
                    marginLeft: Sizes.horizontalPadding,
                    marginRight: Sizes.horizontalPadding
                }}>Select a Source for {this.state.measureSpec.name}</Text>
                <ScrollView style={{ flex: 1 }}>
                    {
                        sourceManager.installedServices
                            .filter(s => s.getMeasureOfSpec(this.state.measureSpec))
                            .map(service => <ServiceElement
                                key={service.name}
                                source={service}
                                onClick={async () => {
                                    const serviceMeasure = service.getMeasureOfSpec(this.state.measureSpec)

                                    if (serviceMeasure.dependencies.length > 0) {
                                        let dependencyResult: boolean = await serviceMeasure.dependencies[0].tryResolve()
                                        for (let i = 0; i < serviceMeasure.dependencies.length; i++) {
                                            if (dependencyResult === true) {
                                                dependencyResult = await serviceMeasure.dependencies[i].tryResolve()
                                            } else {
                                                break;
                                            }
                                        }
                                        if (dependencyResult === true) {
                                            await sourceManager.selectSourceMeasure(serviceMeasure, false)
                                            this.props.navigation.dismiss()
                                            this.props.navigation.state.params.onServiceSelected(serviceMeasure)
                                        } else {

                                        }
                                    } else {
                                        await sourceManager.selectSourceMeasure(serviceMeasure, false)
                                        this.props.navigation.dismiss()
                                        this.props.navigation.state.params.onServiceSelected(serviceMeasure)
                                    }
                                }} />)
                    }
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const ServiceElement = (props: { onClick: () => void, source: DataSource }) => {
    return <TouchableOpacity activeOpacity={0.3} onPress={() => { props.onClick() }}>
        <ImageBackground
            style={{
                justifyContent: 'center',
                alignSelf: 'stretch',
                alignItems: 'center',
                aspectRatio: 2.5 / 1,
                marginRight: 20,
                marginLeft: 20,
            }}
            imageStyle={{ borderRadius: 12 }}
            source={require("../../../../../assets/images/services/service_fitbit.png")}
        >
            <Text style={{
                ...StyleTemplates.titleTextStyle as any,
                fontSize: 36,
                alignContent: 'center',
                fontWeight: '600',
                color: "white"
            }}>{props.source.name}</Text>
        </ImageBackground>
    </TouchableOpacity>
}

export const ServiceSelectionWizardStack = createStackNavigator(
    {
        ServiceSelection: {
            screen: ServiceSelectionScreen
        }
    }, {
    initialRouteName: "ServiceSelection",
    defaultNavigationOptions: (navigationProp) => ({
        headerTransparent: true,
        headerLeftContainerStyle: { paddingLeft: 12 },
        headerLeft: (
            <Button title="Cancel" onPress={() => navigationProp.navigation.dismiss()} />
        )
    })
}
)