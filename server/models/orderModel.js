const mongoose = require('mongoose');
const cron = require('node-cron');
const moment = require('moment-timezone');

const orderScheme = new mongoose.Schema({   
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    addressId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    orderItems:[{
        itemId: {
            type:  mongoose.Schema.Types.ObjectId,
            ref: 'books',
            required: true
        },
        name: String,
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        },
        price: Number
    }],
    TotalAmt:{
        type: Number,
        required: true,
    },
    discount:{
        type: Number,
    },
    couponCode: {
        type: String,
    },
    payableTotal: Number,
    paymentMethod:{
        type: String,
    },
    paymentStatus:{
        type: String,
        default: "Not Paid",
    },
    orderStatus:{
        type: String,
        default: "Order Placed",
    },
    orderDate:{
        type: Date,
        default: moment().tz('Asia/Kolkata').toDate(),
    },
    deliveryDate :{
        type: Date,
        default: function() {
            const orderDate = moment(this.orderDate).tz('Asia/Kolkata'); 
            return orderDate.add(5, 'days').toDate();
        }
    },
    cancelReason:{
        type: String,
    }
});

async function updateOrderStatus(){
    const currentDate = new Date();
    try {
        const status = await orderCollection.find({
            orderStatus: "Order Placed",
            deliveryDate: {$lt: currentDate},
        })
        if(status.length > 0){
            await Promise.all(
                status.map(async (order) =>{
                    order.orderStatus = "Delivered";
                    await order.save();
                })
            )
            console.log('Updated orderStatus to "delivered" for orders:');
        }

    } catch (error) {
        console.error('Error updating delivered orders:', error);
    }
}

cron.schedule('0 0 * * *', async () => {
    console.log('Running task to update delivered orders...');
    await updateOrderStatus();
  });

const orderCollection = mongoose.model('Orders', orderScheme);
module.exports = orderCollection;