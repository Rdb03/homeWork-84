import mongoose, {model, Schema, Types} from "mongoose";
import User from "./User";

const TaskSchema = new mongoose.Schema({
   user: {
       type: Schema.Types.ObjectId,
       required: true,
       validate: {
           validator: async (value: Types.ObjectId) => {
               const user = await User.findById(value);
               return Boolean(user);
           },
           message: 'User does not exist!',
       }
   },
    title: {
       type: String,
        required: true,
    },
    description: String,
    status: {
        type: String,
        enum: ['new', 'in_progress', 'complete'],
        validate: {
            validator: async (enumValue: string) => {
               return ['new', 'in_progress', 'complete'].includes(enumValue);
            },
            message: 'Invalid status value',
        },
        default: 'new',
        required: true,
    }
});

const Task = model('Task', TaskSchema);

export default Task;