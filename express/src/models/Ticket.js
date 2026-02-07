const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  session_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  seat_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seat',
    required: true
  }
}, {
  timestamps: true
});

// Garantir que um assento não seja reservado duas vezes para a mesma sessão
ticketSchema.index({ session_id: 1, seat_id: 1 }, { unique: true });

module.exports = mongoose.model('Ticket', ticketSchema);
