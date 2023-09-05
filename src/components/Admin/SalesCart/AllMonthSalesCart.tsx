import { db } from "@/firebase/client";
import { Box, Text } from "@chakra-ui/react"
import { collection, getDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Current Year Sales Chart',
        },
    },
}

const getCurrentMonthData = (dataObj: any) => {
    const today = new Date();
    const currentMonth = today.getMonth(); // Get the index of the current month (0 - 11)
    const daysInMonth = new Date(today.getFullYear(), currentMonth + 1, 0).getDate(); // Get the number of days in the current month

    const labels = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const data = [];

    for (let month = 1; month <= daysInMonth; month++) {
        // labels.push(`Day ${day}`);

        // If data for the current day exists in the input object, use it; otherwise, set 0
        const sales = dataObj[month] || 0;
        data.push(sales);
    }

    return {
        labels,
        datasets: [
            {
                label: 'Total Sales in USD',
                data: Object.values(dataObj),
                borderColor: '#FF0046',
                backgroundColor: '#FF0046',
            },
        ],
    };
};

function AllMonthSalesCart() {
    const [totalOrders, setTotalOrders] = useState<any[]>([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const OrdersQuery = collection(db, "Orders");
            await onSnapshot(OrdersQuery, (ordersSnapshot) => {
                const OrdersArr: any[] = [];
                ordersSnapshot.docs.map(async (value) => {
                    const docSnap = await getDoc(value.data().userRef);
                    if (docSnap.exists()) {
                        OrdersArr.push({
                            ...value.data(),
                            id: value.id,
                            UserRef: docSnap.data(),
                        });
                    } else {
                        console.log("user Not found");
                    }
                });
                setTimeout(() => {
                    setTotalOrders(OrdersArr);
                }, 1000);
            });
        };
        fetchOrders();
    }, []);

    const orders = totalOrders;
    const currentYear = new Date().getFullYear();

    // Create an object to store the total USD amount for each month
    const monthlyUSDTotal: any = {
        1: 0, // January
        2: 0, // February
        3: 0, // March
        4: 0, // April
        5: 0, // May
        6: 0, // June
        7: 0, // July
        8: 0, // August
        9: 0, // September
        10: 0, // October
        11: 0, // November
        12: 0, // December
    };

    orders.forEach(order => {
        const orderDate = new Date(order.OrderDate.seconds * 1000);
        const orderYear = orderDate.getFullYear();
        const orderMonth: any = orderDate.getMonth() + 1;

        if (orderYear === currentYear) {
            monthlyUSDTotal[orderMonth] += order.USDTotal;
        }
    });

    // console.log(monthlyUSDTotal);

    const data: any = getCurrentMonthData(monthlyUSDTotal);

    return (
        <Box
            width={{ md: "49%" }}
            mt={4}
            py={{ base: "2", sm: "4" }}
            px={{ base: "2", sm: "5" }}
            bg={"bg-surface"}
            boxShadow={{ base: "none", sm: "md" }}
            borderRadius={"xl"}
            border="2px solid rgba(0, 0, 0, 0.1)"
        >
            <Line options={options} data={data} />
            <Text textAlign={"center"} mt={3}>{currentYear} Sales</Text>
        </Box>
    )
}

export default AllMonthSalesCart;