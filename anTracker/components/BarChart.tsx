import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
type BarChartProps = {
    chartData: {label: string, value:number}[]
}
export const BarChartComponent: React.FC<BarChartProps> = ({chartData }) => {
    return (
        <View style={styles.chartContainer}>
            {chartData.length > 0 && (
                <BarChart
                    overflowTop={25}
                    height={175}
                    width={225}
                    yAxisThickness={1}
                    xAxisThickness={1}
                    data={chartData}
                    barWidth={30}
                    barBorderRadius={5}
                    frontColor="#A37366"
                    isAnimated
                    spacing={35}
                    noOfSections={4}
                    renderTooltip={(item: any, index: any) => {
                        return (
                            <View
                                style={{
                                    marginBottom: 5,
                                    marginTop: 50,
                                    marginLeft: -6,
                                    backgroundColor: '#D3AEA2 ',
                                    paddingHorizontal: 6,
                                    paddingVertical: 4,
                                    borderRadius: 4,
                                }}>
                                <Text>${item.value}</Text>
                            </View>
                        );
                    }}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
chartContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        marginHorizontal: '5%',
        paddingTop: 25,
        padding: 10,
        backgroundColor: '#fff',
        marginBottom: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        paddingBottom: 15
    },
})