import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import PropTypes from 'prop-types';

// ✅ Gán màu theo tên trạng thái (không lệch khi thiếu giá trị)
const COLOR_MAP = {
    'Đã hủy': '#ff4d4f',
    'Chờ xác nhận': '#ffa940',
    'Chờ giao hàng': '#ffec3d',
    'Đang vận chuyển': '#bae637',
    'Đã giao hàng': '#40a9ff',
    'Hoàn thành': '#52c41a',
};

// ✅ Custom Legend Component
const RenderCustomLegend = ({ payload }) => {
    return (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap' }}>
            {payload.map((entry, index) => (
                <li key={`item-${index}`} style={{ marginRight: 20, display: 'flex', alignItems: 'center' }}>
                    <div style={{
                        width: 12,
                        height: 12,
                        backgroundColor: entry.color,
                        marginRight: 6,
                    }} />
                    <span style={{ color: entry.color }}>
                        {entry.value} - {entry.payload.percentage}%
                    </span>
                </li>
            ))}
        </ul>
    );
};

RenderCustomLegend.propTypes = {
    payload: PropTypes.arrayOf(
        PropTypes.shape({
            color: PropTypes.string,
            value: PropTypes.string,
            payload: PropTypes.shape({
                percentage: PropTypes.string,
            }),
        })
    ).isRequired,
};

const TrangThaiPieChart = ({ dataResponse }) => {
    const rawData = [
        { name: 'Đã hủy', value: dataResponse?.daHuy ?? 0 },
        { name: 'Chờ xác nhận', value: dataResponse?.choXacNhan ?? 0 },
        { name: 'Chờ giao hàng', value: dataResponse?.choGiaoHang ?? 0 },
        { name: 'Đang vận chuyển', value: dataResponse?.dangVanChuyen ?? 0 },
        { name: 'Đã giao hàng', value: dataResponse?.daGiaoHang ?? 0 },
        { name: 'Hoàn thành', value: dataResponse?.hoanThanh ?? 0 },
    ];

    const filteredData = rawData.filter(item => item.value > 0);
    const total = filteredData.reduce((sum, item) => sum + item.value, 0);

    const formattedData = filteredData.map((item) => ({
        ...item,
        percentage: total ? ((item.value / total) * 100).toFixed(2) : '0.00',
        color: COLOR_MAP[item.name],
    }));

    return (
        <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={formattedData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                    >
                        {formattedData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value, name, props) =>
                            [`${value} đơn (${props.payload.percentage}%)`, name]
                        }
                    />
                    <Legend content={<RenderCustomLegend />} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

// ✅ PropTypes cho component chính
TrangThaiPieChart.propTypes = {
    dataResponse: PropTypes.shape({
        daHuy: PropTypes.number,
        choXacNhan: PropTypes.number,
        choGiaoHang: PropTypes.number,
        dangVanChuyen: PropTypes.number,
        daGiaoHang: PropTypes.number,
        hoanThanh: PropTypes.number,
    }),
};
TrangThaiPieChart.propTypes = {
  payload: PropTypes.shape({
    percentage: PropTypes.number,
  }),
};

export default TrangThaiPieChart;
