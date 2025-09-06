import { MontoPorCategoria } from "@/app/(tabs)/graficos";
import { useState } from "react";
import { Text, View } from "react-native";
import { PieChart } from 'react-native-gifted-charts';

type DrawerProps = {
    pieData: { gradientCenterColor: string, color: string; value: number; }[];
    montosPorCategoria: MontoPorCategoria[]
};

export const PieChartComponent: React.FC<DrawerProps> = ({ pieData, montosPorCategoria }) => {
    const renderDot = (color: string) => {
        return (
            <View
                style={{
                    height: 10,
                    width: 10,
                    borderRadius: 5,
                    backgroundColor: color,
                    marginRight: 10,
                }}
            />
        );
    };

    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

    const total = pieData.reduce((sum, item) => sum + item.value, 0);
    const centerLabel = () => {
        if (focusedIndex === null) {
            return (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 22, color: '#A37366', fontWeight: 'bold' }}>100.0%</Text>
                </View>
            );
        }

        const item = pieData[focusedIndex];
        const percentage = ((item.value / total) * 100).toFixed(1) + '%';

        return (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 22, color: '#A37366', fontWeight: 'bold' }}>
                    {percentage}
                </Text>
            </View>
        );
    };

    const renderLegendComponent = () => {
        return (
            <>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginBottom: 10,
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            flexWrap: 'wrap'
                        }}>
                        {montosPorCategoria.map((element, key) => (
                            <View key={key} style={{ width: 120, flexDirection: "row", alignItems: "center", marginRight: 18 }}>
                                {renderDot(element.categoria_color)}
                                <Text style={{ color: "#000000ff" }}>{element.categoria_nombre}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </>
        );
    };

    return (
        <View style={{ padding: 10, borderRadius:20, borderColor: '#fff', alignItems: 'center' }}>
            {pieData.length > 0 && (
                <PieChart
                    data={pieData}
                    donut
                    showGradient
                    sectionAutoFocus
                    focusOnPress
                    radius={90}
                    innerRadius={60}
                    innerCircleColor={'#fff'}
                    centerLabelComponent={centerLabel}
                    onPress={(item: any, index: any) => setFocusedIndex(index)}
                />)}
            {renderLegendComponent()}
        </View>
    )
}