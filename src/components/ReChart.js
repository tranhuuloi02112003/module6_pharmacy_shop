import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Select from 'react-select';
import {format, addDays, lastDayOfMonth, startOfWeek, endOfWeek} from 'date-fns';
import 'react-toastify/dist/ReactToastify.css';
import {toast, ToastContainer} from "react-toastify";
import './rechart.css';
// npm run build

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
    const [selectedTimeOption, setSelectedTimeOption] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [showChart, setShowChart] = useState(false);

    //Weekkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk

    const [selectedWeek, setSelectedWeek] = useState(null);
    const [weekOptions, setWeekOptions] = useState([]);
    const [weekStartDate, setWeekStartDate] = useState(null);
    const [weekEndDate, setWeekEndDate] = useState(null);

    const handleWeekChange = (selectedWeek) => {
        setSelectedWeek(selectedWeek);

        if (selectedWeek && selectedYear) {
            const startOfWeek = new Date(selectedYear.value, 0, 1);
            startOfWeek.setDate(startOfWeek.getDate() + (selectedWeek.value - 1) * 7 - startOfWeek.getDay());
            setWeekStartDate(startOfWeek);

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(endOfWeek.getDate() + 6);
            setWeekEndDate(endOfWeek);
        }
    };
    const calculateWeeksInYear = (year) => {
        const weeks = [];
        let currentDate = new Date(year, 0, 1);

        while (currentDate.getFullYear() === year) {
            weeks.push({ value: weeks.length + 1, label: `Tuần ${weeks.length + 1}` });
            currentDate.setDate(currentDate.getDate() + 7);
        }

        return weeks;
    };
    //Weekkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk

    const timeOptions = [
        { value: 'year', label: 'Năm' },
        { value: 'month', label: 'Tháng' },
        { value: 'week', label: 'Tuần' },
    ];

    const monthOptions = Array.from({ length: 12 }, (_, i) => ({
        value: i + 1,
        label: `Tháng ${i + 1}`,
    }));

    const yearOptions = Array.from({ length: new Date().getFullYear() - 1999 }, (_, i) => ({
        value: new Date().getFullYear() - i,
        label: new Date().getFullYear() - i,
    }));

    const handleTimeChange = (selectedOption) => {
        setSelectedTimeOption(selectedOption);
        setSelectedMonth(null);
        setSelectedYear(null);
    };

    const handleMonthChange = (selectedMonth) => {
        setSelectedMonth(selectedMonth);
    };

    const handleYearChange = (selectedYear) => {
        if (selectedTimeOption && selectedTimeOption.value === 'week' && selectedYear) {
            const weeks = calculateWeeksInYear(selectedYear.value);
            setWeekOptions(weeks);
        }
        setSelectedYear(selectedYear);
    };
    const displayTime = () => {
        if (selectedTimeOption && selectedTimeOption.value === 'year' && selectedYear) {
            return `Từ 01/01/${selectedYear.value} đến 31/12/${selectedYear.value}`;
        } else if (selectedTimeOption && selectedTimeOption.value === 'month' && selectedMonth && selectedYear) {
            const lastDay = new Date(selectedYear.value, selectedMonth.value, 0).getDate();
            return `Từ 01/${selectedMonth.value}/${selectedYear.value} đến ${lastDay}/${selectedMonth.value}/${selectedYear.value}`;
        }
        if(weekStartDate && weekEndDate ) {
            return`Từ ${format(weekStartDate, 'dd/MM/yyyy')} đến ${format(weekEndDate, 'dd/MM/yyyy')}`
        }
        return '';
    };

    const handleViewChart = () => {
        if (!selectedTimeOption) {
            toast.warning('Vui lòng chọn đầy đủ thời gian.');
            return;
        }

        if (selectedTimeOption.value === 'month' && !selectedMonth) {
            toast.warning('Vui lòng chọn tháng.');
            return;
        }
        if (selectedTimeOption.value === 'month' && !selectedYear) {
            toast.warning('Vui lòng chọn năm.');
            return;
        }
        if (selectedTimeOption.value === 'year'  && !selectedYear ) {
            toast.warning('Vui lòng chọn năm.');
            return;
        }
        if (selectedTimeOption.value === 'week' && (!selectedYear || !selectedWeek )) {
            toast.warning('Vui lòng chọn tuần hoặc năm');
            return;
        }


        if (selectedTimeOption && selectedTimeOption.value === 'month' && selectedMonth && selectedYear) {
            const newData = fetchDataByMonth(selectedMonth, selectedYear);
            setData(newData);
        }

        if (selectedTimeOption && selectedTimeOption.value === 'week' && selectedYear && selectedWeek) {
            const newData = fetchDataByWeek(selectedYear, selectedWeek);
            setData(newData);
        }
        setShowChart(true);
    };

    const fetchDataByWeek = (selectedYear, selectedWeek) => {
        const startOfWeekDate = startOfWeek(new Date(selectedYear.value, 0, 1));
        startOfWeekDate.setDate(startOfWeekDate.getDate() + (selectedWeek.value - 1) * 7);

        const endOfWeekDate = endOfWeek(new Date(startOfWeekDate));

        const newData = Array.from({ length: 7 }, (_, i) => ({
            date: format(addDays(new Date(startOfWeekDate), i), 'yyyy-MM-dd'),
            revenue: Math.floor(Math.random() * 100000) + 50000,
            profit: Math.floor(Math.random() * 50000) + 20000,
        }));

        return newData;
    };

    const fetchDataByMonth = (selectedMonth, selectedYear) => {
        const daysInMonth = lastDayOfMonth(new Date(selectedYear.value, selectedMonth.value - 1)).getDate();
        const newData = Array.from({ length: daysInMonth }, (_, i) => ({
            date: format(addDays(new Date(selectedYear.value, selectedMonth.value - 1), i), 'yyyy-MM-dd'),
            revenue: Math.floor(Math.random() * 100000) + 50000,
            profit: Math.floor(Math.random() * 50000) + 20000,
        }));
        console.log(newData)
        return newData;
    };

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-1"></div>
                    <div className="col-4">
                        <div>
                            <fieldset className="border rounded-3 p-3" id="fieldset-time">
                                <legend><b>Thời gian</b></legend>
                                <div className="time-selector">
                                    <Select
                                        value={selectedTimeOption}
                                        onChange={handleTimeChange}
                                        options={timeOptions}
                                        placeholder="Chọn loại thời gian"
                                    />
                                    {selectedTimeOption && selectedTimeOption.value === 'year' && (
                                        <Select
                                            value={selectedYear}
                                            onChange={handleYearChange}
                                            options={yearOptions}
                                            placeholder="Năm"
                                        />
                                    )}
                                    {(selectedTimeOption && selectedTimeOption.value === 'month') && (
                                        <>
                                            <Select
                                                value={selectedMonth}
                                                onChange={handleMonthChange}
                                                options={monthOptions}
                                                placeholder="Tháng"
                                            />

                                            <Select
                                                value={selectedYear}
                                                onChange={handleYearChange}
                                                options={yearOptions}
                                                placeholder="Năm"
                                            />
                                        </>
                                    )}

                                    {selectedTimeOption && selectedTimeOption.value === 'week' && (
                                        <>
                                            <Select
                                                value={selectedYear}
                                                onChange={handleYearChange}
                                                options={yearOptions}
                                                placeholder="Năm"
                                            />
                                            <Select
                                                value={selectedWeek}
                                                onChange={handleWeekChange}
                                                options={weekOptions}
                                                placeholder="Tuần"
                                            />
                                        </>
                                    )}
                                </div>
                                <p>{displayTime()}</p>
                                <button className="button-view-chart" onClick={handleViewChart}><i
                                    className="bi bi-bar-chart"> </i> Xem báo cáo và biểu đồ</button>
                            </fieldset>
                        </div>
                        <div>
                            <fieldset className="border rounded-3 p-3" id="fieldset-repot">
                                <legend><b>Báo cáo chi tiết</b></legend>
                                {showChart ? (
                                    <div className="detail-report">
                                        <div className="revenue">
                                            <label htmlFor="revenue">Doanh thu</label>
                                            <input type="text" name="" id="revenue" defaultValue="400000000" />
                                        </div>
                                        <div className="profit">
                                            <label htmlFor="profit">Lợi nhuận</label>
                                            <input type="text" name="" id="profit" defaultValue="20000000" />
                                        </div>
                                        <div className="revenue">
                                            <label htmlFor="medium-revenue">Doanh thu TB</label>
                                            <input type="text" name="" id="medium-revenue" defaultValue="35000000" />
                                        </div>
                                        <div className="profit">
                                            <label htmlFor="medium-profit">Lợi nhuận TB</label>
                                            <input type="text" name="" id="medium-profit" defaultValue="19000000" />
                                        </div>
                                    </div>
                                    ) : (
                                        <p>Chưa có dữ liệu</p>
                                    )
                                }
                            </fieldset>
                        </div>
                    </div>
                    <div className="col-6">
                        <div>
                            <fieldset className="border rounded-3 p-3" id="fieldset-chart">
                                <legend><b>Biểu đồ Doanh thu và Lợi nhuận</b></legend>
                                {showChart ? (
                                    data.length > 0 ? (
                                        <ResponsiveContainer className="chart" height={300}>
                                            <LineChart width={600} height={300} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                                <XAxis dataKey="date" />
                                                <YAxis />
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <Tooltip />
                                                <Legend />
                                                <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} name="Doanh thu"/>
                                                <Line type="monotone" dataKey="profit" stroke="#82ca9d" name="Lợi nhuận" />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <p>Chưa có dữ liệu</p>
                                    )
                                ) : (
                                    <p>Chưa có dữ liệu</p>
                                )}
                            </fieldset>
                        </div>
                    </div>
                    <div className="col-1"></div>
                </div>
            </div>
            <ToastContainer />
        </>
    );

};

export default ReChart;
