<template>
  <a-card :bordered="false">
    <div class="filter-container" style="margin-bottom: 15px">
      <a-input-search
        @keyup.enter.native="handleFilter"
        style="width: 200px;"
        placeholder="角色类型名称"
        v-model="listQuery.name"
        @search="handleFilter()"
        enterButton></a-input-search>
      <a-button
        class="table-operator"
        v-if="groupTypeManager_btn_add"
        style="margin-left: 10px;"
        @click="handleCreate"
        type="primary"
        icon="edit">添加</a-button>
    </div>
    <el-table
      :key="tableKey"
      :data="list"
      v-loading.body="listLoading"
      border
      fit
      highlight-current-row
      style="width: 100%">
      <el-table-column width="200px" align="center" label="编码">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>

      </el-table-column>
      <el-table-column width="200px" align="center" label="类型名称"><template slot-scope="scope">
        <span>
          {{ scope.row.name }}</span>
      </template>

      </el-table-column>
      <el-table-column width="350px" align="center" label="描述">
        <template slot-scope="scope">
          <span>
            {{ scope.row.description }}
          </span>
        </template>

      </el-table-column>
      <el-table-column width="200px" align="center" label="最后更新时间"><template slot-scope="scope">
        <span>
          {{ scope.row.updTime }}</span>
      </template>
      </el-table-column>
      <el-table-column width="210px" align="center" label="最后更新人"><template slot-scope="scope">
        <span>
          {{ scope.row.updName }}</span>
      </template>

      </el-table-column>
      <el-table-column align="center" label="操作" width="150"><template slot-scope="scope">
        <el-button :disabled="scope.row.code === 'role'||scope.row.code === 'org'" v-if="groupTypeManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">
          编辑
        </el-button>
        <el-button :disabled="scope.row.code === 'role'||scope.row.code === 'org'" v-if="groupTypeManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
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
        :total="total">
      </el-pagination>
    </div>
    <a-modal :title="textMap[dialogStatus]" @cancel="cancel" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="编码" prop="code">
          <a-input v-model="form.code" placeholder="请输入编码"></a-input>
        </el-form-item>
        <el-form-item label="类型名称" prop="name">
          <a-input v-model="form.name" placeholder="请输入类型名称"></a-input>
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
  </a-card>
</template>
<script>
import {
  page,
  addObj,
  getObj,
  delObj,
  putObj
} from '@/api/admin/groupType/index'
import { mapGetters } from 'vuex'
export default {
  name: 'GroupType',
  data () {
    return {
      form: {
        id: undefined,
        code: undefined,
        name: undefined,
        description: undefined
      },
      rules: {
        code: [{
          required: true,
          message: '请输入编码',
          trigger: 'blur'
        }, {
          min: 3,
          max: 20,
          message: '长度在 3 到 20 个字符',
          trigger: 'blur'
        }],
        name: [{
          required: true,
          message: '请输入类型名称',
          trigger: 'blur'
        }, {
          min: 3,
          max: 20,
          message: '长度在 3 到 20 个字符',
          trigger: 'blur'
        }],
        description: [{
          required: true,
          message: '请输入描述',
          trigger: 'blur'
        }, {
          min: 3,
          max: 20,
          message: '长度在 3 到 20 个字符',
          trigger: 'blur'
        }]
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
      groupTypeManager_btn_edit: false,
      groupTypeManager_btn_del: false,
      groupTypeManager_btn_add: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0
    }
  },
  created () {
    this.getList()
    this.groupTypeManager_btn_edit = this.elements['groupTypeManager:btn_edit']
    this.groupTypeManager_btn_del = this.elements['groupTypeManager:btn_del']
    this.groupTypeManager_btn_add = this.elements['groupTypeManager:btn_add']
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
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
      const { $notification, getList } = this
      this.$confirm({
        title: '提示',
        content: '此操作将永久删除, 是否继续? ?',
        onOk () {
          delObj(row.id).then(() => {
            getList()
            $notification['success']({
              message: '提示',
              description: '删除成功',
              duration: 8
            })
          })
        },
        onCancel () {
        }
      })
    },
    create (formName) {
      this.$refs[formName].validate(valid => {
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
      this.resetTemp()
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
              description: '更新成功',
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
        id: undefined,
        code: undefined,
        name: undefined,
        description: undefined
      }
    }
  }
}
</script>
