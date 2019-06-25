<template>
  <a-card :bordered="false">
    <div class="filter-container" style="margin-bottom: 15px">
      <a-input-search
        @keyup.enter.native="handleFilter"
        style="width: 200px;margin-right: 10px"
        placeholder="服务名称"
        v-model="listQuery.swaggerName"
        @search="handleFilter()"
        enterButton></a-input-search>
      <a-button
        class="filter-item"
        v-if="swaggerListManager_btn_add"
        style="margin-left: 10px;"
        @click="handleCreate"
        type="primary"
        icon="edit">添加
      </a-button>
    </div>
    <el-table
      :key="tableKey"
      :data="list"
      v-loading.body="listLoading"
      border
      fit
      highlight-current-row
      style="width: 100%">
      <el-table-column align="center" label="ID" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column width="300" align="center" label="服务名称">
        <template slot-scope="scope">
          <span>{{ scope.row.swaggerName }}</span>
        </template>
      </el-table-column>
      <el-table-column width="300" align="center" label="路径">
        <template slot-scope="scope">
          <span>{{ scope.row.swaggerLocation }}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" align="center" label="版本号">
        <template slot-scope="scope">
          <span>{{ scope.row.swaggerVersion }}</span>
        </template>
      </el-table-column>
      <el-table-column width="286" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.crtTime }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="260">
        <template slot-scope="scope">
          <el-button v-if="swaggerListManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="swaggerListManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"></el-pagination>
    </div>
    <a-modal :title="textMap[dialogStatus]" @cancel="cancel('form')" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="名称" prop="swaggerName">
          <a-input v-model="form.swaggerName" placeholder="请输入Swagger名称"></a-input>
        </el-form-item>
        <el-form-item label="路径" prop="swaggerLocation">
          <a-input
            placeholder="请输入路径编码"
            addonBefore="/api/"
            addonAfter="/v2/api-docs')"
            v-model="form.swaggerLocation">
          </a-input>
        </el-form-item>
        <el-form-item label="版本号" prop="swaggerVersion">
          <a-input v-model="form.swaggerVersion" placeholder="请输入版本号"></a-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </a-modal>
  </a-card>
</template>

<script>
import {
  page,
  addObj,
  getObj,
  delObj,
  putObj
} from '@/api/admin/swaggerList/index'
import { mapGetters } from 'vuex'

export default {
  name: 'SwaggerList',
  data () {
    return {
      form: {
        swaggerName: undefined,
        swaggerLocation: undefined,
        swaggerVersion: undefined,
        crtUserName: undefined,
        crtUserId: undefined,
        crtTime: undefined,
        updUserName: undefined,
        updUserId: undefined,
        updTime: undefined
      },
      rules: {
        swaggerName: [
          {
            required: true,
            message: '请输入Swagger名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 64,
            message: '长度在 1 到 64 个字符',
            trigger: 'blur'
          }
        ],
        swaggerLocation: [
          {
            required: true,
            message: '请输入路径',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 220,
            message: '长度在 1 到 220 个字符',
            trigger: 'blur'
          }
        ],
        swaggerVersion: [
          {
            required: true,
            message: '请输入版本号',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ]
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      swaggerListManager_btn_edit: false,
      swaggerListManager_btn_del: false,
      swaggerListManager_btn_add: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0
    }
  },
  created () {
    this.getList()
    this.swaggerListManager_btn_edit = this.elements['swaggerListManager:btn_edit']
    this.swaggerListManager_btn_del = this.elements['swaggerListManager:btn_del']
    this.swaggerListManager_btn_add = this.elements['swaggerListManager:btn_add']
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    getList () {
      this.listLoading = true
      page(this.listQuery)
        .then(response => {
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
    handleCreate () {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate (row) {
      getObj(row.id)
        .then(response => {
          this.form = response.data
          this.form.swaggerLocation = this.form.swaggerLocation.substring(5, this.form.swaggerLocation.indexOf('/v2'))
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
    create (formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addObj(this.form)
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
    update (formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
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
    resetTemp () {
      this.form = {
        swaggerName: undefined,
        swaggerLocation: undefined,
        swaggerVersion: '2.0'
      }
    }
  }
}
</script>
