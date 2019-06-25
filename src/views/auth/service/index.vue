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
        <a-button
          class="filter-item"
          v-if="serviceManager_btn_add"
          style="margin-left: 10px;margin-right: 10px"
          @click="handleCreate"
          type="primary"
          icon="edit">添加</a-button>
        <a-button
          class="filter-item"
          type="dashed"
          style="margin-left: 10px;margin-right: 10px"
          v-if="serviceManager_btn_clientManager"
          @click="handlerClient">
          授权服务</a-button>
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
        <el-table-column width="200px" align="center" label="服务编码">
          <template slot-scope="scope">
            <span>{{ scope.row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="服务密钥">
          <template slot-scope="scope">
            <span>{{ scope.row.secret }}</span>
          </template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="服务名">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column width="200px" align="center" label="是否锁定">
      <template  slot-scope="scope">
        <span>{{scope.row.locked}}</span>
      </template>
    </el-table-column> -->
        <el-table-column width="200px" align="center" label="描述">
          <template slot-scope="scope">
            <span>{{ scope.row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="创建时间">
          <template slot-scope="scope">
            <span>{{ scope.row.crtTime }}</span>
          </template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="创建人">
          <template slot-scope="scope">
            <span>{{ scope.row.crtUser }}</span>
          </template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="创建人姓名">
          <template slot-scope="scope">
            <span>{{ scope.row.crtName }}</span>
          </template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="创建主机">
          <template slot-scope="scope">
            <span>{{ scope.row.crtHost }}</span>
          </template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="更新时间">
          <template slot-scope="scope">
            <span>{{ scope.row.updTime }}</span>
          </template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="更新人">
          <template slot-scope="scope">
            <span>{{ scope.row.updUser }}</span>
          </template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="更新姓名">
          <template slot-scope="scope">
            <span>{{ scope.row.updName }}</span>
          </template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="更新主机">
          <template slot-scope="scope">
            <span>{{ scope.row.updHost }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="150"> <template slot-scope="scope">
          <el-button v-if="serviceManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="serviceManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
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
      <a-modal :title="textMap[dialogStatus]" @cancel="cancel('form')" :visible.sync="dialogFormVisible">
        <el-form :model="form" :rules="rules" ref="form" label-width="100px">
          <el-form-item label="服务编码" prop="code">
            <a-input v-model="form.code" placeholder="请输入服务编码"></a-input>
          </el-form-item>
          <el-form-item label="服务密钥" prop="secret">
            <a-input v-model="form.secret" placeholder="请输入服务密钥"></a-input>
          </el-form-item>
          <el-form-item label="服务名" prop="name">
            <a-input v-model="form.name" placeholder="请输入服务名"></a-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <a-input v-model="form.description" placeholder="请输入描述"></a-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <a-button @click="cancel('form')">取 消</a-button>
          <a-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</a-button>
          <a-button v-else type="primary" @click="update('form')">确 定</a-button>
        </div>
      </a-modal>
      <a-modal :title="dialogClientName" @cancel="closeClientDialog" :visible.sync="dialogClientVisible">
        <el-form label-width="80px">
          <el-form-item label="允许访问服务">
            <el-select
              v-model="clients"
              multiple
              filterable
              remote
              placeholder="请输入服务关键词"
              :remote-method="remoteMethod"
              :loading="loading">
              <el-option v-for="item in items" :key="item.id" :label="item.name" :value="item.id"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <a-button type="primary" v-if="serviceManager_btn_clientManager" @click="onSubmit">保存</a-button>
          </el-form-item>
        </el-form>
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
  putObj,
  getClients,
  modifyClients
} from '@/api/auth/service/index'
import { mapGetters } from 'vuex'
export default {
  name: 'Client',
  components: {
    'service-client': () => import('./client')
  },
  data () {
    return {
      items: [],
      clients: [],
      form: {
        code: undefined,
        secret: undefined,
        name: undefined,
        description: undefined
      },
      rules: {
        code: [
          {
            required: true,
            message: '请输入服务编码',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ],
        secret: [
          {
            required: true,
            message: '请输入服务密钥',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: '请输入服务名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ],
        description: [
          {
            required: true,
            message: '请输入描述',
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
      list: undefined,
      total: null,
      clienttotal: null,
      listLoading: true,
      loading: false,
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
      serviceManager_btn_clientManager: false,
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
    this.serviceManager_btn_clientManager = this.elements['serviceManager:btn_clientManager']
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
    handleCreate () {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate (row) {
      getObj(row.id).then(response => {
        this.form = response.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    handleDelete (row) {
      const { $confirm, $notification, list } = this
      $confirm({
        title: '提示',
        content: '此操作将永久删除, 是否继续? ?',
        onOk () {
          delObj(row.id).then(() => {
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
    handlerClient () {
      if (this.currentId !== null && this.currentId !== -1) {
        this.initClients()
        this.dialogClientVisible = true
        if (this.$refs.serviceClient !== undefined) {
          this.$refs.serviceClient.serviceId = this.currentId
          this.$refs.serviceClient.initClients()
        }
      } else {
        this.$message.info('请先选择服务，然后再进行授权')
      }
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
    update (formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.form.password = undefined
          putObj(this.form.id, this.form).then(() => {
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
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true
        page({
          name: query
        }).then(response => {
          this.items = response.data.rows
          this.clienttotal = response.data.total
          this.loading = false
        })
      } else {
        this.items = []
      }
    },
    onSubmit () {
      const vals = {}
      if (this.clients.length > 0) vals.clients = this.clients.join()
      modifyClients(this.currentId, vals).then(() => {
        this.$emit('closeClientDialog')
        this.$notification['success']({
          message: '提示',
          description: '保存成功',
          duration: 8
        })
      })
    },
    initClients () {
      getClients(this.currentId).then(response => {
        this.items = response.data
        const leas = []
        for (let i = 0; i < response.data.length; i++) {
          leas.push(response.data[i].id)
        }
        this.clients = leas
      })
    },
    resetTemp () {
      this.form = {
        id: undefined,
        code: undefined,
        secret: undefined,
        name: undefined,
        description: undefined
      }
    }
  }
}
</script>
