import { useEffect, useRef } from "react";
import { SciChartReact } from "scichart-react";
import {
  SciChartSurface,
  NumericAxis,
  FastColumnRenderableSeries,
  XyDataSeries,
  WaveAnimation,
  GradientParams,
  Point,
  PaletteFactory,
  Thickness,
  NumberRange,
  ZoomPanModifier,
  ZoomExtentsModifier,
  MouseWheelZoomModifier,
  EHorizontalTextPosition,
  EVerticalTextPosition,
  SciChartJsNavyTheme,
  TextLabelProvider,
} from "scichart";
import type { IThemeProvider } from "scichart";

SciChartSurface.useWasmFromCDN();

const CATEGORIES = [
  "Groceries",
  "Food&Coffee",
  "Transport",
  "Auto",
  "Entertainment",
  "Shopping",
  "Utilities",
  "Health",
  "Transfers",
  "Other",
];

class AppTheme {
  SciChartJsTheme: IThemeProvider = new SciChartJsNavyTheme();
  ForegroundColor = "#FFFFFF";
  VividSkyBlue = "#50C7E0";
  VividTeal = "#30BC9A";
  VividOrange = "#F48420";
  PaleSkyBlue = "#E4F5FC";
}

const appTheme = new AppTheme();

export default function PieChart({
  spendingsData,
}: {
  spendingsData: Record<string, number>;
}) {
  const wasmContextRef = useRef<any>(null);
  const surfaceRef = useRef<SciChartSurface | null>(null);

  useEffect(() => {
    if (!surfaceRef.current || !wasmContextRef.current) return;
    const surface = surfaceRef.current;
    const wasmContext = wasmContextRef.current;

    surface.renderableSeries.clear();

    const xValues = CATEGORIES.map((_, i) => i);
    const yValues = CATEGORIES.map((cat) => spendingsData[cat] ?? 0);

    surface.renderableSeries.add(
      new FastColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
        fill: appTheme.PaleSkyBlue + "77",
        stroke: appTheme.PaleSkyBlue,
        strokeThickness: 2,
        dataPointWidth: 0.7,
        cornerRadius: 20,
        dataLabels: {
          horizontalTextPosition: EHorizontalTextPosition.Center,
          verticalTextPosition: EVerticalTextPosition.Above,
          style: {
            fontFamily: "Arial",
            fontSize: 16,
            padding: new Thickness(0, 0, 8, 0),
          },
          color: appTheme.ForegroundColor,
          precision: 0,
        },
        animation: new WaveAnimation({ duration: 1000 }),
        paletteProvider: PaletteFactory.createGradient(
          wasmContext,
          new GradientParams(new Point(0, 0), new Point(1, 1), [
            { offset: 0, color: appTheme.VividOrange },
            { offset: 0.67, color: appTheme.VividSkyBlue },
            { offset: 1.0, color: appTheme.VividTeal },
          ]),
          { enableFill: true },
        ),
      }),
    );

    surface.zoomExtents();
  }, [spendingsData]);

  const initChart = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(
      rootElement,
      { theme: appTheme.SciChartJsTheme },
    );

    sciChartSurface.xAxes.add(
      new NumericAxis(wasmContext, {
        labelProvider: new TextLabelProvider({ labels: CATEGORIES }),
      }),
    );
    sciChartSurface.yAxes.add(
      new NumericAxis(wasmContext, {
        growBy: new NumberRange(0, 0.1),
        labelPrecision: 0,
      }),
    );

    const xValues = CATEGORIES.map((_, i) => i);
    const yValues = CATEGORIES.map((cat) => spendingsData[cat] ?? 0);

    const dataSeries = new XyDataSeries(wasmContext, { xValues, yValues });
    wasmContextRef.current = wasmContext;
    surfaceRef.current = sciChartSurface;

    sciChartSurface.renderableSeries.add(
      new FastColumnRenderableSeries(wasmContext, {
        dataSeries,
        fill: appTheme.PaleSkyBlue + "77",
        stroke: appTheme.PaleSkyBlue,
        strokeThickness: 2,
        dataPointWidth: 0.7,
        cornerRadius: 20,
        dataLabels: {
          horizontalTextPosition: EHorizontalTextPosition.Center,
          verticalTextPosition: EVerticalTextPosition.Above,
          style: {
            fontFamily: "Arial",
            fontSize: 16,
            padding: new Thickness(0, 0, 8, 0),
          },
          color: appTheme.ForegroundColor,
          precision: 0,
        },
        animation: new WaveAnimation({ duration: 1000 }),
        paletteProvider: PaletteFactory.createGradient(
          wasmContext,
          new GradientParams(new Point(0, 0), new Point(1, 1), [
            { offset: 0, color: appTheme.VividOrange },
            { offset: 0.67, color: appTheme.VividSkyBlue },
            { offset: 1.0, color: appTheme.VividTeal },
          ]),
          { enableFill: true },
        ),
      }),
    );

    sciChartSurface.chartModifiers.add(
      new ZoomPanModifier({ enableZoom: true }),
    );
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
    sciChartSurface.zoomExtents();

    return { sciChartSurface, wasmContext };
  };

  return <SciChartReact initChart={initChart} className="h-[65%] my-5 rounded-xl overflow-hidden" />;
}
