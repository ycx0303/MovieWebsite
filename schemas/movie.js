var mongoose = require('mongoose')

var MovieSchema = new mongoose.Schema({
  doctor:String,
  title:String,
  language:String,
  country:String,
  summary:String,
  flash:String,
  poster:String,
  year:Number,
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

MovieSchema.pre('save', function(next){
  if(this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }else{
    this.meta.updateAt = Date.now()
  }

  next()
})

MovieSchema.static = {
  fetch: function(cb){
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb)
  },
  findById: function(id,cb){
    return this
      .findOne({_id: id})
      .exec(cb)
  }
}
MovieSchema.statics={
	// 用fetch方法获取所有的数据
	fetch:function(callback){
		return this
		.find({})
		.sort('meta.updateAt')
		.exec(callback);
		// 根据更新的时间排序
	},
	findById:function(id,callback){
		return this
		.findOne({_id:id})
		.exec(callback);
	}
};
module.exports = MovieSchema