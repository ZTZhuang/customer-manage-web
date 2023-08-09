<template>
  <div class="account-container">
    <el-button size="mini" type="primary" @click="handleAdd">新增</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="username" label="账号"> </el-table-column>
      <el-table-column prop="customerCount" label="客户数"> </el-table-column>
      <el-table-column prop="createTime" label="创建时间"> </el-table-column>
      <el-table-column prop="updateTime" label="更新时间"> </el-table-column>
      <el-table-column prop="forbidden" label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.forbidden ? 'danger' : 'success'">{{
            scope.row.forbidden ? '停用' : '正常'
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          <el-button
            size="mini"
            :type="scope.row.forbidden ? 'success' : 'danger'"
            @click="handleChangeForbidden(scope.row)"
          >
            {{ scope.row.forbidden ? '启用' : '停用' }}
          </el-button>
          <el-button size="mini" type="primary" @click="handleShowCustomer(scope.row)">查看客户</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="form.id ? '编辑' : '新增'" :visible.sync="dialogVisible" width="400px">
      <el-form ref="form" :model="form" :rules="rules" label-width="auto">
        <el-form-item label="账号" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="查看客户" :visible.sync="dialogCustomerVisible" width="800px">
      <el-table :data="customerList" style="width: 100%">
        <el-table-column prop="name" label="客户名"> </el-table-column>
        <el-table-column prop="phone" label="联系电话"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="industry" label="行业"> </el-table-column>
        <el-table-column prop="address" label="地址"> </el-table-column>
        <el-table-column prop="remark" label="备注"> </el-table-column>
        <el-table-column prop="createTime" label="创建时间"> </el-table-column>
        <el-table-column prop="updateTime" label="更新时间"> </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { getAccountList, addAccount, updateAccount, deleteAccount } from '@/api/account';

export default {
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!new RegExp(/^[a-zA-Z0-9#$%_-]+$/).test(value)) {
        callback(new Error('用户名只能是字母、数字或者 #、$、%、_、- 这些字符'));
      }
      callback();
    };
    return {
      tableData: [],
      dialogVisible: false,
      form: {},
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' },
          { validator: validateUsername, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 30, message: '长度在 6 到 30 个字符', trigger: 'blur' }
        ]
      },
      dialogCustomerVisible: false,
      customerList: []
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      getAccountList().then(res => {
        this.tableData = res.data;
      });
    },
    handleAdd() {
      this.form = {};
      this.dialogVisible = true;
      if (this.$refs['form']) {
        this.$refs['form'].clearValidate();
      }
    },
    handleEdit(row) {
      this.form = {
        id: row.id,
        username: row.username
      };
      this.dialogVisible = true;
      if (this.$refs['form']) {
        this.$refs['form'].clearValidate();
      }
    },
    confirm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id) {
            updateAccount(this.form).then(() => {
              this.dialogVisible = false;
              this.$message({
                message: '更新成功',
                type: 'success'
              });
              this.getList();
            });
          } else {
            addAccount(this.form).then(() => {
              this.dialogVisible = false;
              this.$message({
                message: '新增成功',
                type: 'success'
              });
              this.getList();
            });
          }
        }
      });
    },
    handleDelete(row) {
      this.$confirm('确认删除该账号?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAccount(row.id).then(() => {
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.getList();
        });
      });
    },
    handleChangeForbidden(row) {
      this.$confirm(`确认${row.forbidden ? '启用' : '停用'}该账号?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          id: row.id,
          forbidden: !row.forbidden
        };
        updateAccount(data).then(() => {
          this.$message({
            message: `${row.forbidden ? '启用' : '停用'}成功`,
            type: 'success'
          });
          this.getList();
        });
      });
    },
    handleShowCustomer(row) {
      this.dialogCustomerVisible = true;
      this.customerList = row.customers;
    }
  }
};
</script>

<style lang="scss" scoped>
.account-container {
  padding: 20px;
}
</style>
