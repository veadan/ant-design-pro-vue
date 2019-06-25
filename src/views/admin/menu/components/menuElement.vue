<template>
  <div class="table-operator">
    <a-row :gutter="8">
      <a-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="资源名称" v-model="listQuery.name">
      </a-input>
      <a-button style="margin-left: 8px" type="primary" icon="search" @click="handleFilter">搜索</a-button>
      <a-button
        class="filter-item"
        v-if="menuManager_btn_element_add"
        style="margin-left: 10px;"
        @click="handleCreate"
        type="primary"
        icon="edit">添加</a-button>
    </a-row>
    <div style="margin: 24px 0"></div>
    <el-table
      :key="tableKey"
      :data="list"
      v-loading.body="listLoading"
      border
      fit
      highlight-current-row
      style="width: 100%">
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <a-button v-if="menuManager_btn_element_edit" size="small" icon="form" type="dashed" @click="handleUpdate(scope.row)">
          </a-button>
          <a-button v-if="menuManager_btn_element_del" size="small" icon="delete" type="danger" @click="handleDelete(scope.row)">
          </a-button>
        </template>
      </el-table-column>
      <el-table-column width="260px" align="center" label="资源编码">
        <template slot-scope="scope">
          <span>
            {{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column width="80px" align="center" label="资源类型">
        <template slot-scope="scope">
          <span>
            {{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="资源名称">
        <template slot-scope="scope">
          <span>
            {{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="资源地址">
        <template slot-scope="scope">
          <span>
            {{ scope.row.uri }}</span>
        </template>
      </el-table-column>
      <el-table-column width="80px" align="center" label="请求类型">
        <template slot-scope="scope">
          <span>
            {{ scope.row.method }}</span>
        </template>
      </el-table-column>
      <el-table-column width="190px" align="center" label="描述">
        <template slot-scope="scope">
          <span>
            {{ scope.row.description }}</span>
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
        <el-form-item label="资源编码" prop="code">
          <a-input v-model="form.code" placeholder="请输入资源编码"></a-input>
        </el-form-item>
        <el-form-item label="资源类型" prop="type">
          <a-select v-model="form.type" placeholder="请输入资源类型">
            <a-select-option v-for="item in typeOptions" :key="item.value">{{ item.labelDefault }}</a-select-option>
          </a-select>
        </el-form-item>
        <el-form-item label="资源名称" prop="name">
          <a-input v-model="form.name" placeholder="请输入资源名称"></a-input>
        </el-form-item>
        <el-form-item label="资源地址" prop="uri">
          <a-input v-model="form.uri" placeholder="请输入资源地址"></a-input>
        </el-form-item>
        <el-form-item label="请求类型" prop="method">
          <a-select class="filter-item" v-model="form.method" placeholder="请输入资源请求类型">
            <a-select-option v-for="item in methodOptions" :key="item" :value="item">{{ item }} </a-select-option>
          </a-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <a-button @click="cancel('form')">取 消</a-button>
        <a-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</a-button>
        <a-button v-else type="primary" @click="update('form')">确 定</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import {
  page,
  addObj,
  getObj,
  delObj,
  putObj
} from '@/api/admin/element/index'
import { mapGetters } from 'vuex'
import { getTypeValue } from '@/api/dict/dictValue/index'
export default {
  name: 'MenuElement',
  // props: {
  //   menuId: {
  //     default: '1'
  //   }
  // },
  data () {
    return {
      methodOptions: ['GET', 'POST', 'PUT', 'DELETE'],
      typeOptions: [],
      form: {
        code: undefined,
        type: undefined,
        name: undefined,
        uri: undefined,
        menuId: undefined,
        method: undefined,
        description: undefined
      },
      rules: {
        code: [{
          required: true,
          message: '请输入资源编码',
          trigger: 'blur'
        }
        ],
        type: [{
          required: true,
          message: '请输入资源类型',
          trigger: 'blur'
        },
        {
          min: 2,
          max: 20,
          message: '长度在 2 到 20 个字符',
          trigger: 'blur'
        }
        ],
        name: [{
          required: true,
          message: '请输入资源名称',
          trigger: 'blur'
        },
        {
          min: 2,
          max: 20,
          message: '长度在 2 到 20 个字符',
          trigger: 'blur'
        }
        ],
        uri: [{
          required: true,
          message: '请输入',
          trigger: 'blur'
        },
        {
          min: 3,
          max: 40,
          message: '长度在 3 到 40 个字符',
          trigger: 'blur'
        }
        ],
        method: [{
          required: true,
          message: '请输入资源请求类型',
          trigger: 'blur'
        },
        {
          min: 3,
          max: 20,
          message: '长度在 3 到 20 个字符',
          trigger: 'blur'
        }
        ],
        description: [{
          required: true,
          message: '请输入',
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
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        menuId: this.menuId
      },
      dialogFormVisible: false,
      dialogStatus: '',
      menuManager_btn_element_add: false,
      menuManager_btn_element_edit: false,
      menuManager_btn_element_del: false,
      menuId: -1,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0
    }
  },
  created () {
    this.getList()
    this.menuManager_btn_element_add = this.elements['menuManager:btn_element_add']
    this.menuManager_btn_element_del = this.elements['menuManager:btn_element_del']
    this.menuManager_btn_element_edit = this.elements['menuManager:btn_element_edit']
    getTypeValue('authority_element').then(response => {
      this.typeOptions = response.data.rows
    })
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    getList () {
      this.listLoading = true
      this.listQuery.menuId = this.menuId
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
      this.form.menuId = this.menuId
      set[formName].validate(valid => {
        if (valid) {
          addObj(this.form).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notification['success']({
              message: '成功',
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
      this.form.menuId = this.menuId
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          this.form.password = undefined
          putObj(this.form.id, this.form).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notification['success']({
              message: '成功',
              description: '修改',
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
        code: undefined,
        type: undefined,
        name: undefined,
        uri: undefined,
        menuId: undefined,
        method: undefined,
        description: undefined
      }
    }
  }
}
</script>
