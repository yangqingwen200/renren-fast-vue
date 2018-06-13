<template>
  <div>
    <template v-for="column in columns">
      <el-table-column v-if="column.operations" :prop="column.prop" :label="column.label" :width="column.width" :formatter="column.formatter"
                       :header-align="column.headerAlign ? column.headerAlign : 'center'" :align="column.align ? column.align : 'center'">
        <template slot-scope="scope">
          <template v-for="operate in column.operations">
            <el-button v-if="isAuth(operate.pms)" size="mini" type="text" @click="operate.func(scope.row)">{{operate.label}}</el-button>
          </template>
        </template>
      </el-table-column>
      <el-table-column v-else-if="column.custom" :type="column.type" :prop="column.prop" :label="column.label" :width="column.width"
                       :header-align="column.headerAlign ? column.headerAlign : 'center'" :align="column.align ? column.align : 'center'">
        <template slot-scope="scope">
          <span v-html="column.custom(scope.row, scope.row[column.prop])"></span>
        </template>
      </el-table-column>
      <el-table-column v-else :type="column.type" :prop="column.prop" :label="column.label" :width="column.width" :formatter="column.formatter"
                       :header-align="column.headerAlign ? column.headerAlign : 'center'" :align="column.align ? column.align : 'center'">
      </el-table-column>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'index',
    props: {
      columns: {
        type: Array,
        required: true
      }
    }
  }
</script>

<style scoped>

</style>
