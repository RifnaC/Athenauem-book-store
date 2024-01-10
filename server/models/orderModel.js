const mongoose = require('mongoose');
const cron = require('node-cron');

const orderScheme = new mongoose.Schema({   
    userId:{
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    addressId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'addresses',
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
        default: new Date().toLocaleDateString(),
    },
    deliveryDate :{
        type: Date,
        default: function() {
        const orderDate = new Date(this.orderDate); 
        const deliveryDate = new Date(orderDate);
        deliveryDate.setDate(deliveryDate.getDate() + 5); 
        return deliveryDate.toLocaleDateString();
        }

    },
});

async function updateOrderStatus(){
    const currentDate = new Date();
    try {
        const status = await orderCollection.find({
            orderStatus: "Order Placed",
            deliveryDate: {$lt: currentDate},
        })
        if(status.length > 0){
            await promise.all(
                status.map(async (order) =>{
                    order.status = "Delivered";
                    await order.save();
                })
            )
            console.log('Updated orderStatus to "delivered" for orders:', status.map(order => order._id));
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