const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  mealType: {
    type: String,
    required: true
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true
  },
  description: {
    type: String,
    required: true
  },
  addedBy: {
    type: String // Admin name (optional)
  },
  attending: [
    {
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student' // Assuming 'User' is your student model
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Food', foodSchema);
// const mongoose = require('mongoose');

// const foodSchema = new mongoose.Schema({
//   mealType: {
//     type: String,
//     required: true,
//     enum: ['breakfast', 'lunch', 'dinner', 'snacks']
//   },
//   date: {
//     type: String, // YYYY-MM-DD
//     required: true
//   },
//   attending: [
//     {
//       studentId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//       }
//     }
//   ]
// }, { timestamps: true });

// module.exports = mongoose.model('Food', foodSchema);

//before that big// const mongoose = require('mongoose');

// const foodSchema = new mongoose.Schema({
//   mealType: { type: String, required: true },
//   date: { type: String, required: true },
//   attending: [
//     {
//       studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
//     }
//   ],
//   addedBy: { type: String },
//   description: { type: String } // ✅ New field
// });

// module.exports = mongoose.model('Food', foodSchema);


// const mongoose = require('mongoose');

// const foodSchema = new mongoose.Schema({
//   mealType: { type: String, enum: ['breakfast', 'lunch', 'snacks', 'dinner'], required: true },
//   date: { type: String, required: true },
//   attending: [
//     {
//       studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
//     }
//   ]
//     addedBy: { type: String } 
// });

// module.exports = mongoose.model('Food', foodSchema);

// // 
