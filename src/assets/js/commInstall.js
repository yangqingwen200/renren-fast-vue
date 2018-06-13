
/* 使用插件的方式, 扩展Vue默认的方法或者组件或者属性
   使用方法: 在main.js中导入后, 使用Vue.use(showMessage), 然后在vue对象中, 使用this.showMsg()即可
*/
const showMessage = {
  // 有install后, 才能使用use方法
  install: function (Vue) {
    Vue.prototype.showMsg = function (data, callback) {
      if (data && data.code === 0) {
        if (callback) {
          callback()
        }
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 1500,
          center: 'center',
          onClose: () => {
          }
        })
      } else {
        this.$message.error(data.msg)
      }
    }
  }
}

const showConfirm = {
  install: function (Vue) {
    Vue.prototype.showCfm = function (msg) {
      return this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
    }
  }
}
export default {
  showMessage,
  showConfirm
}
