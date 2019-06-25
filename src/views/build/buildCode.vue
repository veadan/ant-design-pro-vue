<template>
  <div class="app-container calendar-list-container">
    <a-col :span="14">
      <a-card :bordered="false" title="数据库信息">
        <div class="filter-container" style="margin-bottom: 15px">
          <a-button
            class="filter-item"
            v-if="buildCodeManager_btn_add"
            style="margin-left: 10px;"
            @click="handleCreate"
            type="primary"
            icon="edit">添加
          </a-button>
          <el-tag type="info" style="float:right" closable>温馨提示:用完后请删除信息，以免泄露信息。</el-tag>
        </div>
        <el-table
          :key="2"
          :data="list"
          v-loading.body="listLoading"
          @current-change="handleDataCurrentChange"
          border
          fit
          highlight-current-row
          style="width: 100%">
          <el-table-column width="100" align="center" label="ID">
            <template slot-scope="scope">
              <span>{{ scope.row.key }}</span>
            </template>
          </el-table-column>
          <el-table-column width="300" align="center" label="数据库IP">
            <template slot-scope="scope">
              <span>{{ scope.row.ip }}</span>
            </template>
          </el-table-column>
          <el-table-column width="150" align="center" label="端口号">
            <template slot-scope="scope">
              <span>{{ scope.row.port }}</span>
            </template>
          </el-table-column>
          <el-table-column width="200" align="center" label="数据库名称">
            <template slot-scope="scope">
              <span>{{ scope.row.dbName }}</span>
            </template>
          </el-table-column>
          <el-table-column width="200" align="center" label="用户名">
            <template slot-scope="scope">
              <span>{{ scope.row.username }}</span>
            </template>
          </el-table-column>
          <el-table-column width="150" align="center" label="密码">
            <template slot-scope="scope">
              <span>{{ scope.row.password }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" align="center" label="操作" width="160">
            <template slot-scope="scope">
              <el-button v-if="buildCodeManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
              </el-button>
              <el-button v-if="buildCodeManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </a-card>
      <a-modal :title="textMap[dialogStatus]" @cancel="cancel('form')" :visible.sync="dialogFormVisible">
        <el-form :model="form" :rules="rules" ref="form" label-width="100px">
          <el-form-item label="关键字" prop="key">
            <a-input
              v-model="form.key"
              placeholder="关键字"></a-input>
          </el-form-item>
          <el-form-item label="IP地址" prop="ip">
            <a-input v-model="form.ip" placeholder="IP地址"></a-input>
          </el-form-item>
          <el-form-item label="端口号" prop="port">
            <a-input
              v-model="form.port"
              placeholder="端口号"></a-input>
          </el-form-item>
          <el-form-item label="数据库名称" prop="dbName">
            <a-input v-model="form.dbName" placeholder="数据库名称"></a-input>
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <a-input
              v-model="form.username"
              placeholder="用户名"></a-input>
          </el-form-item>
          <el-form-item label="数据库密码" prop="password">
            <a-input v-model="form.password" placeholder="请输入数据库密码"></a-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <a-button @click="cancel('form')">取 消</a-button>
          <a-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</a-button>
          <a-button v-else type="primary" @click="update('form')">确 定</a-button>
        </div>
      </a-modal>
    </a-col>
    <a-col :span="9" style="margin-left: 10px">
      <a-card :bordered="false" :title="'数据源为：'+this.currentKey">
        <div class="filter-container" style="margin-bottom: 15px">
          <a-input-search
            @keyup.enter.native="handleFilter"
            style="width: 200px;margin-right: 10px"
            placeholder="服务名称"
            v-model="listQuery.tableName"
            @search="handleFilter()"
            enterButton></a-input-search>
          <a-button
            class="filter-item"
            v-if="buildCodeManager_btn_add"
            style="margin-left: 10px;"
            @click="handleBuild"
            type="dashed"
            icon="edit">批量构建
          </a-button>
        </div>
        <el-table
          ref="buildTable"
          @selection-change="handleSelectionChange"
          :key="2"
          :data="tableList"
          v-loading.body="tablelistLoading"
          border
          fit
          highlight-current-row
          style="width: 100%">
          <el-table-column
            type="selection"
            align="center"
            width="55">
          </el-table-column>
          <el-table-column width="250" align="center" label="表名">
            <template slot-scope="scope">
              <span>{{ scope.row.tableName }}</span>
            </template>
          </el-table-column>
          <el-table-column width="200" align="center" label="中文注释">
            <template slot-scope="scope">
              <span>{{ scope.row.tableComment }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="listQuery.offset"
            :page-sizes="[10,20,30, 50]"
            :page-size="listQuery.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"></el-pagination>
        </div>
      </a-card>
      <a-modal :title="'生成代码'" @cancel="tableCancel('form')" :visible.sync="dialogTableFormVisible">
        <el-form :model="buildCodeEntity" :rules="tablerules" ref="form" label-width="100px">
          <el-form-item label="包路径名" prop="codePackage">
            <a-input
              v-model="buildCodeEntity.codePackage"
              placeholder="包路径名"></a-input>
          </el-form-item>
          <el-form-item label="前端模板名称" prop="mainModule">
            <a-input v-model="buildCodeEntity.mainModule" placeholder="前端模板名称"></a-input>
          </el-form-item>
          <el-form-item label="作者名称" prop="author">
            <a-input
              v-model="buildCodeEntity.author"
              placeholder="作者名称"></a-input>
          </el-form-item>
          <el-form-item label="电子邮箱" prop="email">
            <a-input v-model="buildCodeEntity.email" placeholder="电子邮箱"></a-input>
          </el-form-item>
          <el-form-item label="表前缀忽略" prop="tablePrefix">
            <a-input
              v-model="buildCodeEntity.tablePrefix"
              placeholder="表前缀忽略"></a-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <a-button @click="tableCancel('form')">取 消</a-button>
          <a-button type="primary" @click="buildProject('form')">确 定</a-button>
        </div>
      </a-modal>
    </a-col>

  </div>
</template>

<script>
import {
  dbList,
  addDbObj,
  delDbObj,
  tablePage,
  buildProject
} from '@/api/build/index'
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
import ACol from 'ant-design-vue/es/grid/Col'

export default {
  name: 'BuildCode',
  components: { ACol },
  data () {
    return {
      form: {
        key: undefined,
        ip: undefined,
        port: undefined,
        dbName: undefined,
        username: undefined,
        password: undefined
      },
      serviceList: [],
      rules: {
        key: [
          {
            required: true,
            message: '请输入关键字',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 120,
            message: '长度在 1 到 120 个字符',
            trigger: 'blur'
          }
        ],
        ip: [
          {
            required: true,
            message: '请输入忽略的路径',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 120,
            message: '长度在 1 到 120 个字符',
            trigger: 'blur'
          }
        ],
        port: [
          {
            required: true,
            message: '请输入描述',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 120,
            message: '长度在 1 到 120 个字符',
            trigger: 'blur'
          }
        ],
        dbName: [
          {
            required: true,
            message: '请输入创建人名称',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ],
        username: [
          {
            required: true,
            message: '请输入创建人名称',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入创建人名称',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ]
      },
      tablerules: {
        codePackage: [
          {
            required: true,
            message: '请输入包路径如:com.test',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 120,
            message: '长度在 1 到 120 个字符',
            trigger: 'blur'
          }
        ],
        mainModule: [
          {
            required: true,
            message: '请输入前端模块名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 120,
            message: '长度在 1 到 120 个字符',
            trigger: 'blur'
          }
        ],
        author: [
          {
            required: true,
            message: '请输入代码作者名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 120,
            message: '长度在 1 到 120 个字符',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入email',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ]
      },
      list: null,
      total: null,
      listLoading: true,
      dialogFormVisible: false,
      dialogTableFormVisible: false,
      dialogStatus: '',
      buildCodeManager_btn_edit: false,
      buildCodeManager_btn_del: false,
      buildCodeManager_btn_add: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      tableList: [],
      tablelistLoading: false,
      currentKey: '',
      listQuery: {
        offset: 1,
        limit: 10,
        key: undefined,
        tableName: undefined
      },
      tablesChecks: [],
      buildCodeEntity: {
        tables: undefined,
        key: undefined,
        codePackage: undefined,
        author: undefined,
        email: undefined,
        tablePrefix: undefined,
        mainModule: undefined
      }
    }
  },
  created () {
    this.getList()
    this.buildCodeManager_btn_edit = this.elements['buildCodeManager:btn_edit']
    this.buildCodeManager_btn_del = this.elements['buildCodeManager:btn_del']
    this.buildCodeManager_btn_add = this.elements['buildCodeManager:btn_add']
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    getTableList () {
      tablePage(this.listQuery)
        .then(res => {
          this.tableList = res.data.rows
          this.total = res.data.total
          this.tablelistLoading = false
        })
    },
    getList () {
      this.listLoading = true
      dbList()
        .then(response => {
          this.list = response.data
          this.listLoading = false
        })
    },
    handleFilter () {
      this.getTableList()
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.listQuery.key = this.currentKey
      this.getTableList()
    },
    handleCurrentChange (val) {
      this.listQuery.key = this.currentKey
      this.listQuery.offset = val
      this.getTableList()
    },
    handleCreate () {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate (row) {
      this.form = row
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
    },
    handleDataCurrentChange (val) {
      this.listQuery.key = val.key
      this.currentKey = val.key
      this.buildCodeEntity.key = val.key
      this.tablelistLoading = true
      this.handleFilter()
    },
    handleDelete (row) {
      const { $confirm, $notification, list } = this
      $confirm({
        title: '提示',
        content: '此操作将永久删除, 是否继续? ?',
        onOk () {
          delDbObj(row.key).then(() => {
            $notification['success']({
              message: '提示',
              description: '删除成功',
              duration: 8
            })
            const index = list.indexOf(row)
            list.splice(index, 1)
          })
        },
        onCancel () {
        }
      })
    },
    create (formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addDbObj(this.form)
            .then(() => {
              this.dialogFormVisible = false
              this.getList()
              this.$notification['success']({
                message: '提示',
                description: '创建成功',
                duration: 8
              })
            })
        } else {
          return false
        }
      })
    },
    cancel (formName) {
      this.dialogFormVisible = false
      const set = this.$refs
      set[formName].resetFields()
    },
    tableCancel () {
      this.buildCodeEntity.email = undefined
      this.buildCodeEntity.author = undefined
      this.buildCodeEntity.mainModule = undefined
      this.buildCodeEntity.codePackage = undefined
      this.buildCodeEntity.tablePrefix = undefined
      this.buildCodeEntity.tables = undefined
      this.dialogTableFormVisible = false
      this.toggleSelection()
    },
    update (formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          addDbObj(this.form).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notification['success']({
              message: '提示',
              description: '修改成功',
              duration: 8
            })
          })
        } else {
          return false
        }
      })
    },
    handleSelectionChange (val) {
      this.tablesChecks = val
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.buildTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.buildTable.clearSelection()
      }
    },
    handleBuild () {
      this.buildCodeEntity.email = undefined
      this.buildCodeEntity.author = undefined
      this.buildCodeEntity.mainModule = undefined
      this.buildCodeEntity.codePackage = undefined
      this.buildCodeEntity.tablePrefix = undefined
      this.buildCodeEntity.tables = undefined
      this.dialogTableFormVisible = true
    },
    resetTemp () {
      this.form = {
        username: undefined,
        name: undefined,
        sex: '男',
        password: undefined,
        description: undefined
      }
    },
    buildProject (formName) {
      const set = this.$refs
      const tablesList = []
      this.tablesChecks.forEach(item => {
        tablesList.push(item.tableName)
      })
      this.buildCodeEntity.tables = JSON.stringify(tablesList)
      set[formName].validate(valid => {
        if (valid) {
          buildProject(
            this.buildCodeEntity
          ).then(() => {
            const fileName = this.currentKey + '.zip'
            const elink = document.createElement('a')
            elink.download = fileName
            elink.style.display = 'none'
            elink.href =
              '/api/build/build/code?tables=' +
              this.buildCodeEntity.tables + '&key=' + this.buildCodeEntity.key +
              '&codePackage=' + this.buildCodeEntity.codePackage +
              '&author=' + this.buildCodeEntity.author +
              '&token=' +
              getToken() +
              '&email=' + this.buildCodeEntity.email +
              '&mainModule=' + this.buildCodeEntity.mainModule
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
            this.dialogTableFormVisible = false
            this.toggleSelection()
            this.$notification['success']({
              message: '提示',
              description: '代码生成成功',
              duration: 8
            })
          })
        }
      })
    }
  }
}
</script>
