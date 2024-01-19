import React, { useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const ReChart = () => {
    const [data, setData] = useState([
        { month: 'Tháng 1', revenue: 50000, profit: 20000 },
        { month: 'Tháng 2', revenue: 55000, profit: 25000 },
        { month: 'Tháng 3', revenue: 60000, profit: 30000 },
        { month: 'Tháng 4', revenue: 65000, profit: 35000 },
        { month: 'Tháng 5', revenue: 70000, profit: 40000 },
        { month: 'Tháng 6', revenue: 75000, profit: 45000 },
        { month: 'Tháng 7', revenue: 80000, profit: 50000 },
        { month: 'Tháng 8', revenue: 85000, profit: 55000 },
        { month: 'Tháng 9', revenue: 90000, profit: 60000 },
        { month: 'Tháng 10', revenue: 95000, profit: 65000 },
        { month: 'Tháng 11', revenue: 100000, profit: 70000 },
        { month: 'Tháng 12', revenue: 105000, profit: 75000 },
    ]);

    const [timeType, setTimeType] = useState('year');
    const [timeValue, setTimeValue] = useState('');
    const [yearValue, setYearValue] = useState(new Date().getFullYear());

    const changeTimeType = () => {
        const timeType = document.getElementById('timeType').value;

        setTimeType(timeType);

        const timeValue = document.getElementById('timeValue');
        const yearValue = document.getElementById('yearValue');

        while (timeValue.length > 0) {
            timeValue.remove(0);
        }

        while (yearValue.length > 0) {
            yearValue.remove(0);
        }

        const currentYear = new Date().getFullYear();

        for (let i = currentYear; i >= 1900; i--) {
            const option = document.createElement('option');
            option.text = i;
            yearValue.add(option);
        }

        if (timeType === 'year') {
            yearValue.style.display = 'inline';
            timeValue.style.display = 'none';
        } else if (timeType === 'month' || timeType === 'week') {
            for (let i = 1; i <= (timeType === 'month' ? 12 : 52); i++) {
                const option = document.createElement('option');
                option.text = i;
                timeValue.add(option);
            }
            yearValue.style.display = 'inline';
            timeValue.style.display = 'inline';
        }

        displayTime();
    };

    const getWeekDates = (year, week) => {
        const d = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 1 - dayNum);
        const weekStart = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));

        d.setUTCDate(d.getUTCDate() + 6);
        const weekEnd = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));

        return [weekStart, weekEnd];
    };

    const displayTime = () => {
        const timeType = document.getElementById('timeType').value;
        const timeValue = document.getElementById('timeValue').value;
        const yearValue = document.getElementById('yearValue').value;
        const displayTime = document.getElementById('displayTime');

        if (timeType === 'year') {
            displayTime.innerHTML = `Từ 01/01/${yearValue} đến 31/12/${yearValue}`;
        } else if (timeType === 'month') {
            const lastDay = new Date(yearValue, timeValue, 0).getDate();
            displayTime.innerHTML = `Từ 01/${timeValue}/${yearValue} đến ${lastDay}/${timeValue}/${yearValue}`;
        } else if (timeType === 'week') {
            const weekDates = getWeekDates(yearValue, timeValue);
            const weekStart = `${weekDates[0].getDate()}/${weekDates[0].getMonth() + 1}/${weekDates[0].getFullYear()}`;
            const weekEnd = `${weekDates[1].getDate()}/${weekDates[1].getMonth() + 1}/${weekDates[1].getFullYear()}`;
            displayTime.innerHTML = `Từ ${weekStart} đến ${weekEnd}`;
        }
    };

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-2"></div>
                    <div className="col-4">
                        <div>
                            <fieldset className="border rounded-3 p-3">
                                <legend>
                                    <b>Thời gian</b>
                                </legend>
                                <label htmlFor="timeType">Theo</label>

                                <select id="timeType" onChange={changeTimeType}>
                                    <option value="year">Năm</option>
                                    <option value="month">Tháng</option>
                                    <option value="week">Tuần</option>
                                </select>

                                <select id="timeValue"></select>

                                <select id="yearValue"></select>

                                <p id="displayTime"></p>
                            </fieldset>
                        </div>
                        <div>
                            <fieldset className="border rounded-3 p-3">
                                <legend>
                                    <b>Báo cáo chi tiết</b>
                                </legend>
                                <div className="detail-report">
                                    <div className="revenue">
                                        <label htmlFor="revenue">Doanh thu</label>
                                        <input type="text" name="" id="revenue" defaultValue="0" />
                                    </div>
                                    <div className="profit">
                                        <label htmlFor="profit">Lợi nhuận</label>
                                        <input type="text" name="" id="profit" defaultValue="0" />
                                    </div>
                                    <div className="revenue">
                                        <label htmlFor="medium-revenue">Doanh thu TB</label>
                                        <input type="text" name="" id="medium-revenue" defaultValue="0" />
                                    </div>
                                    <div className="profit">
                                        <label htmlFor="medium-profit">Lợi nhuận TB</label>
                                        <input type="text" name="" id="medium-profit" defaultValue="0" />
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                    <div className="col-6">
                        <div>
                            <fieldset className="border rounded-3 p-3">
                                <legend>
                                    <b>Biểu đồ Doanh thu và Lợi nhuận</b>
                                </legend>
                                <ResponsiveContainer className="chart" height={300}>
                                    <LineChart width={600} height={300} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                                        <Line type="monotone" dataKey="profit" stroke="#82ca9d" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </fieldset>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ReChart;
