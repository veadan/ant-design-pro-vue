<template>
  <a-card :bordered="false">
    <div class="app-container calendar-list-container">
      <div class="filter-container" style="margin-bottom: 15px">
        <a-input-search
          @keyup.enter.native="handleFilter"
          style="width: 200px;margin-right: 10px"
          placeholder="服务名称"
          v-model="listQuery.name"
          @search="handleFilter()"
          enterButton></a-input-search>
      </div>
      <el-table
        :key="tableKey"
        :data="list"
        v-loading.body="listLoading"
        @current-change="handleDataCurrentChange"
        border
        fit
        highlight-current-row
        style="width: 100%">

        <el-table-column align="center" label="id" width="65">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column width="250px" align="center" label="服务编码">
          <template slot-scope="scope">
            <span>{{ scope.row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="服务密钥">
          <template slot-scope="scope">
            <span>{{ scope.row.secret }}</span>
          </template>
        </el-table-column>
        <el-table-column width="300px" align="center" label="服务名">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column width="300px" align="center" label="描述">
          <template slot-scope="scope">
            <span>{{ scope.row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="150"> <template slot-scope="scope">
          <el-button v-if="serviceManager_btn_edit" size="small" type="success" @click="handlerGenerator(scope.row)">构建服务
          </el-button>
        </template> </el-table-column>
      </el-table>
      <div v-show="!listLoading" class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="listQuery.page"
          :page-sizes="[10,20,30, 50]"
          :page-size="listQuery.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"> </el-pagination>
      </div>
      <a-modal :title="dialogProjectName" @cancel="cancel('buildProjectForm')" :visible.sync="dialogProjectFormVisible">
        <el-form :model="buildProjectForm" :rules="buildProjectFormRules" ref="buildProjectForm" label-width="100px">
          <el-form-item label="package" prop="package">
            <a-input v-model="buildProjectForm.package" placeholder="请输入工程包路径"></a-input>
          </el-form-item>
          <el-form-item label="分布式事务">
            <el-switch on-text="true" off-text="false" v-model="buildProjectForm.tx"></el-switch>
          </el-form-item>
          <el-form-item label="链路追踪">
            <el-switch on-text="true" off-text="false" v-model="buildProjectForm.zipkin"></el-switch>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <a-button @click="cancel('buildProjectForm')">取 消</a-button>
          <a-button type="primary" @click="buildProject('buildProjectForm')">确 定</a-button>
        </div>
      </a-modal>
    </div>
  </a-card>
</template>

<script>
import {
  page,
  addObj,
  getObj,
  delObj,
  buildProject
} from '@/api/auth/service/index'
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
export default {
  name: 'BuildService',
  data () {
    return {
      form: {
        code: undefined,
        secret: undefined,
        name: undefined,
        description: undefined
      },
      buildProjectForm: {
        package: undefined,
        zipkin: 'false',
        tx: 'false'
      },
      buildProjectFormRules: {
        package: [
          {
            required: true,
            message: '请输入合法的包路径',
            trigger: 'blur'
          },
          {
            min: 3,
            message: '长度在 3个字符以上',
            trigger: 'blur'
          }
        ]
      },
      list: [],
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined
      },
      dialogFormVisible: false,
      dialogClientName: '授权服务',
      dialogProjectName: '初始化工程',
      dialogClientVisible: false,
      dialogProjectFormVisible: false,
      dialogStatus: '',
      serviceManager_btn_edit: false,
      serviceManager_btn_del: false,
      serviceManager_btn_add: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      currentId: -1,
      currentName: undefined
    }
  },
  created () {
    this.getList()
    this.serviceManager_btn_edit = this.elements['serviceManager:btn_edit']
    this.serviceManager_btn_del = this.elements['serviceManager:btn_del']
    this.serviceManager_btn_add = this.elements['serviceManager:btn_add']
    this.serviceManager_btn_buidlProject = this.elements['serviceManager:btn_buidlProject']
  },
  computed: {
    ...mapGetters(['elements'])
  },
  methods: {
    getList () {
      this.listLoading = true
      page(this.listQuery).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter () {
      this.getList()
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.getList()
    },
    handleDataCurrentChange (val) {
      this.currentId = val.id
      this.currentName = val.code
    },
    handleUpdate (row) {
      getObj(row.id).then(response => {
        this.form = response.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    handleDelete (row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delObj(row.id).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        })
      })
    },
    handlerClient () {
      this.dialogClientVisible = true
      if (this.$refs.serviceClient !== undefined) {
        this.$refs.serviceClient.serviceId = this.currentId
        this.$refs.serviceClient.initClients()
      }
    },
    handlerGenerator (row) {
      this.currentId = row.id
      this.dialogProjectFormVisible = true
    },
    buildProject (formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          buildProject(
            this.currentId,
            this.buildProjectForm.package
          ).then(() => {
            const fileName = this.currentName + '.zip'
            const elink = document.createElement('a')
            elink.download = fileName
            elink.style.display = 'none'
            elink.href =
              '/api/auth/generator/build?id=' +
              this.currentId +
              '&packageName=' +
              this.buildProjectForm.package +
              '&token=' +
              getToken() +
              '&zipkin=' +
              this.buildProjectForm.zipkin +
              '&tx=' +
              this.buildProjectForm.tx
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
            this.dialogProjectFormVisible = false
          })
        }
      })
    },
    closeClientDialog () {
      this.dialogClientVisible = false
    },
    create (formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addObj(this.form).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          return false
        }
      })
    },
    cancel (formName) {
      this.dialogProjectFormVisible = false
      const set = this.$refs
      set[formName].resetFields()
    },
    resetTemp () {
      this.form = {
        username: undefined,
        name: undefined,
        sex: '男',
        password: undefined,
        description: undefined
      }
    }
  }
}
</script>
