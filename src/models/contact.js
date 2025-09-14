import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String },
    isFavourite: { type: Boolean, default: false },
    contactType: {
      type: String,
      default: 'personal',
      enum: ('work', 'home', 'personal'),
      required: true,
    },
  },
  { timestamps: true },
);

export const Contact = mongoose.model('Contact', contactSchema, 'Contacts');
