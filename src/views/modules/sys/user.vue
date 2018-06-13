<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="用户名">
        <el-input v-model="dataForm.userName" placeholder="请输入用户名" clearable></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="dataForm.status" placeholder="请选择" style="width: 100px">
          <el-option label="全部" value=""></el-option>
          <el-option label="停用" value="0"></el-option>
          <el-option label="正常" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="search()">
          <icon-svg name="search" class="button_svg"></icon-svg>查询
        </el-button>
        <el-button v-if="isAuth('sys:user:save')" type="primary" @click="addOrUpdateHandle()">
          <icon-svg name="add" class="button_svg"></icon-svg>新增
        </el-button>
        <el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">
          <icon-svg name="delete" class="button_svg"></icon-svg>批量删除
        </el-button>
      </el-form-item>
    </el-form>

    <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <my-el-table-column :columns="columns" />
    </el-table>

    <!-- 分页 -->
    <my-el-pagination ref="myPagination" :total-page="totalPage" :watch-obj="dataForm" @data-change="getDataList" />

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" />
  </div>
</template>

<script>
  import AddOrUpdate from './user-add-or-update'
  import myElTableColumn from '../../../components/el-table-column'
  import myElPagination from '../../../components/el-pagination'

  export default {
    data () {
      return {
        dataForm: {
          userName: '',
          status: ''
        },
        dataList: [],
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        // 第一个对象, 渲染出来在表格最后一列, 最后一个对象, 渲染出来在表格的倒数第二列
        columns: [
          {label: '操作',
            operations: [
              {label: '编辑', func: this.addOrUpdateHandle, pms: 'sys:user:update'},
              {label: '删除', func: this.deleteHandle, pms: 'sys:user:delete'}]
          },
          {type: 'selection'},
          {prop: 'userId', label: 'ID', width: 60},
          {prop: 'username', label: '用户名'},
          {prop: 'email', label: '邮箱', headerAlign: 'center', align: 'center'},
          {prop: 'mobile', label: '手机号', formatter: this.dealPhone},
          {prop: 'createTime', label: '创建时间'},
          {prop: 'status', label: '状态', custom: this.customStyle}
        ]
      }
    },
    components: {
      AddOrUpdate,
      myElTableColumn,
      myElPagination
    },
    activated () {
      this.getDataList()
    },
    methods: {
      search () {
        // 自动刷回到第一页
        this.$refs.myPagination.currentChange(1)
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/user/list'),
          method: 'get',
          params: this.$http.adornParams({
            page: this.$refs.myPagination.pageIndex,
            limit: this.$refs.myPagination.pageSize,
            username: this.dataForm.userName,
            status: this.dataForm.status
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (row) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(row ? row.userId : '')
        })
      },
      // 删除
      deleteHandle (row) {
        let userIds = row ? [row.userId] : this.dataListSelections.map(item => {
          return item.userId
        })
        let msg = `确定对[id=${userIds.join(',')}]进行[${row ? '删除' : '批量删除'}]操作?`
        this.showCfm(msg).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/user/delete'),
            method: 'post',
            data: this.$http.adornData(userIds, false)
          }).then(({data}) => {
            this.showMsg(data, function () {
              this.getDataList()
            }.bind(this))
          })
        })
      },
      customStyle (row, cellValue) {
        if (cellValue === 1) {
          // 不能element标签, 如<el-tag>等等, 只能写标签编译过之后class样式
          return '<span class="el-tag el-tag--small">正常</span>'
        } else {
          return '<span class="el-tag el-tag--small el-tag--danger">停用</span>'
        }
      },
      dealPhone (row, column, cellValue) {
        let length = cellValue.length
        let half = length / 2
        let quarter = length / 4
        return cellValue.substr(0, quarter) + '****' + cellValue.substr(half + quarter, length - half - quarter)
      }
    }
  }
</script>
