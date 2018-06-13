<template>

  <!--
  element分页组件存在小bug, 当前页数处于第二页(每页数10), 然后改变每页数(20条), 自动跳回到第一页
   然后再改回每页数10条, 自动跳回到第一页, 此时点击下一页或者页码2, 不发数据请求

    主要是internalCurrentPage和lastEmittedPage相同导致
    改变每页条数, 自动跳回到第一页, 并没有修改lastEmittedPage的值, 仍然为上次最后的页码值.
    详情代码, 可以查看 node_modules\_element-ui@2.3.2@element-ui\packages\pagination\src\pagination.js 的346行 和 197行
   -->

  <el-pagination
    @size-change="sizeChange"
    @current-change="currentChange"
    :current-page="pageIndex"
    :page-sizes="[10, 20, 50, 100]"
    :page-size="pageSize"
    :total="totalPage"
    layout="total, sizes, prev, pager, next, jumper">
  </el-pagination>
</template>

<script>
  export default {
    name: 'pagination',
    data () {
      return {
        pageIndex: this.pageIndexDefault || 1,
        pageSize: this.pageSizeDefault || 10
      }
    },
    props: {
      // 页面初始化页码
      pageIndexDefault: {
        type: Number,
        required: false
      },
      // 每页条数大小
      pageSizeDefault: {
        type: Number,
        required: false
      },
      totalPage: {
        type: Number,
        required: true
      },
      watchObj: {
        type: Object,
        required: false
      }
    },
    watch: {
      watchObj: {
        handler (newValue, oldValue) {
          this.pageIndex = 1
          this.$emit('data-change')
        },
        deep: true
      }
    },
    methods: {
      // 改变每页行数
      sizeChange (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.$emit('data-change')
      },
      // 改变页码: 跳转指定页/上一页/下一页
      currentChange (val) {
        this.pageIndex = val
        this.$emit('data-change')
      }
    }
  }
</script>

<style scoped>

</style>
