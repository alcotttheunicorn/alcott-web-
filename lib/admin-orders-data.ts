export interface OrderDetail {
    id: string
    charge: number
    currency: string
    orderId: string | null
    status: string
    submittedAt: string
    processingStart: string
    processingEnd: string
    sender: { name: string; phone: string; email: string; address: string }
    receiver: { name: string; email: string; phone: string; address: string }
    rider: { name: string; vehicle: string; phone: string; vehicleInfo: string }
    package: { description: string; method: string; weight: string; priority: string }
    delivery: { estDays: number; estDate: string }
    finance: { amountPaid: number; paymentMethod: string; paymentStatus: string; expenses: number; profit: number }
    eventLog: Array<{ event: string; time: string }>
}

export const mockOrderDetails: Record<string, OrderDetail> = {
    '1': {
        id: '1',
        charge: 230000,
        currency: 'NGN',
        orderId: null,
        status: 'pending',
        submittedAt: '03 Aug 2025, 09:19 pm',
        processingStart: '04 Aug 2025, 07:19 am',
        processingEnd: '--:--',
        sender: { name: 'Dave Kingidon', phone: '+2347000467727', email: 'Deng22@gmail.com', address: 'Stockholm 4 Charles way UK' },
        receiver: { name: 'Warner Bros', email: 'warnerbrosfilm@gmail.com', phone: '+2349655630506', address: 'Raminglon St. Building Floor 4' },
        rider: { name: 'Alberdony zaimes', vehicle: 'Bus', phone: '+2349835952554', vehicleInfo: 'Black Toyota agentcar #FBA LAG 222' },
        package: { description: '4 Boxes of professional music production ram', method: 'Single boxing', weight: '2.5kg', priority: 'High Importance' },
        delivery: { estDays: 4, estDate: '08-08-25' },
        finance: { amountPaid: 230000, paymentMethod: 'Card', paymentStatus: 'PAID', expenses: -80000, profit: 50000 },
        eventLog: [],
    },
    '2': {
        id: '2',
        charge: 150000,
        currency: 'NGN',
        orderId: '1679-345898-2367',
        status: 'canceled',
        submittedAt: '02 Aug 2025, 10:00 am',
        processingStart: '--:--',
        processingEnd: '--:--',
        sender: { name: 'John Smith', phone: '+2348012345678', email: 'john@email.com', address: 'Lagos, Nigeria' },
        receiver: { name: 'Jane Doe', email: 'jane@email.com', phone: '+2348087654321', address: 'Abuja, Nigeria' },
        rider: { name: 'N/A', vehicle: 'N/A', phone: 'N/A', vehicleInfo: 'N/A' },
        package: { description: 'Electronics package', method: 'Double boxing', weight: '5kg', priority: 'Normal' },
        delivery: { estDays: 0, estDate: 'N/A' },
        finance: { amountPaid: 0, paymentMethod: 'N/A', paymentStatus: 'CANCELLED', expenses: 0, profit: 0 },
        eventLog: [],
    },
    '3': {
        id: '3',
        charge: 180000,
        currency: 'NGN',
        orderId: '1622-244898-2365',
        status: 'on_process',
        submittedAt: '01 Aug 2025, 02:30 pm',
        processingStart: '02 Aug 2025, 08:00 am',
        processingEnd: '--:--',
        sender: { name: 'Mike Johnson', phone: '+2348011111111', email: 'mike@email.com', address: 'Port Harcourt, Nigeria' },
        receiver: { name: 'Sarah Williams', email: 'sarah@email.com', phone: '+2348022222222', address: 'Kano, Nigeria' },
        rider: { name: 'Emmanuel Okoro', vehicle: 'Van', phone: '+2348099999999', vehicleInfo: 'White Toyota Hiace #ABC 123 LAG' },
        package: { description: 'Furniture items', method: 'Crate boxing', weight: '15kg', priority: 'Medium' },
        delivery: { estDays: 5, estDate: '10-08-25' },
        finance: { amountPaid: 180000, paymentMethod: 'Wallet', paymentStatus: 'PAID', expenses: -60000, profit: 40000 },
        eventLog: [],
    },
    '4': {
        id: '4',
        charge: 95000,
        currency: 'NGN',
        orderId: '1244-244898-2595',
        status: 'initiated',
        submittedAt: '05 Aug 2025, 11:00 am',
        processingStart: '--:--',
        processingEnd: '--:--',
        sender: { name: 'Peter Parker', phone: '+2348033333333', email: 'peter@email.com', address: 'Ibadan, Nigeria' },
        receiver: { name: 'Mary Jane', email: 'mj@email.com', phone: '+2348044444444', address: 'Enugu, Nigeria' },
        rider: { name: 'Pending assignment', vehicle: 'N/A', phone: 'N/A', vehicleInfo: 'N/A' },
        package: { description: 'Documents and files', method: 'Envelope', weight: '0.5kg', priority: 'Low' },
        delivery: { estDays: 3, estDate: '12-08-25' },
        finance: { amountPaid: 95000, paymentMethod: 'Card', paymentStatus: 'PAID', expenses: 0, profit: 0 },
        eventLog: [],
    },
    '5': {
        id: '5',
        charge: 120000,
        currency: 'NGN',
        orderId: '1644-299456-2075',
        status: 'delivered',
        submittedAt: '28 Jul 2025, 09:00 am',
        processingStart: '28 Jul 2025, 11:00 am',
        processingEnd: '30 Jul 2025, 03:00 pm',
        sender: { name: 'Bruce Wayne', phone: '+2348055555555', email: 'bruce@email.com', address: 'Calabar, Nigeria' },
        receiver: { name: 'Clark Kent', email: 'clark@email.com', phone: '+2348066666666', address: 'Jos, Nigeria' },
        rider: { name: 'Chinedu Obi', vehicle: 'Motorcycle', phone: '+2348088888888', vehicleInfo: 'Honda CG #XYZ 789 LAG' },
        package: { description: 'Clothing items', method: 'Soft packaging', weight: '3kg', priority: 'Normal' },
        delivery: { estDays: 2, estDate: '30-07-25' },
        finance: { amountPaid: 120000, paymentMethod: 'Wallet', paymentStatus: 'PAID', expenses: -30000, profit: 35000 },
        eventLog: [{ event: 'Order delivered', time: '30 Jul 2025, 03:00 pm' }],
    },
}
