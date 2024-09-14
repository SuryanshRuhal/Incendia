const expressAsyncHandler =require("express-async-handler");
const generatetoken= require("../config/generatetoken");
const User = require("../modals/UserModel");

const todayBirthdaycontroller = expressAsyncHandler(async(req,res)=>{
   try {
    const todaybirthday = await User.find({
      $expr:{
        $and:[
         {$eq:[{$month:"$birthday"},{$month: new Date()}]},
         {$eq:[{$dayOfMonth:"$birthday"},{$dayOfMonth:new Date()}]}
        ]
      }
    });
   res.status(200);
   res.json(todaybirthday);
   } catch (error) {
    throw new Error(error.message);
   }
});

const upcomingBirthdayController= expressAsyncHandler(async(req,res)=>{
   const today= new Date();
   const nextWeek= new Date(today);
   nextWeek.setDate(today.getDate()+7);

   const todayMonth=today.getMonth()+1;
   const todayDay= today.getDate();
   const nextWeekMonth=nextWeek.getMonth()+1;
   const nextWeekDay= nextWeek.getDate();

   try {
      const upcomingBirthday= await User.find({
         $or:[
            {
               $and:[
                  {$expr:{$eq:[{$month:"$birthday"},todayMonth]}},
                  {$expr:{$gt:[{$dayOfMonth:"$birthday"},todayDay]}},
                  {$expr:{$lte:[{$dayOfMonth:"$birthday"},todayDay+7]}}
               ]
            },
            {
               $and:[
                  {$expr:{$eq:[{$month:"$birthday"},nextWeekMonth]}},
                  {$expr:{$gt:[{$dayOfMonth:"$birthday"},nextWeekDay-7]}},
                  {$expr:{$lte:[{$dayOfMonth:"$birthday"},nextWeekDay]}}
               ]
            }
         ],

      });
      res.status(200);
      res.json(upcomingBirthday);
   } catch (error) {
      throw new Error(error.message);
   }
})
module.exports={
   todayBirthdaycontroller,
   upcomingBirthdayController
}