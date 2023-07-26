<template>
  <div class="Customer-container">
    <el-button size="mini" type="primary" @click="handleAdd">新增</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="客户名"> </el-table-column>
      <el-table-column prop="phone" label="联系电话"> </el-table-column>
      <el-table-column prop="email" label="邮箱"> </el-table-column>
      <el-table-column prop="industry" label="行业"> </el-table-column>
      <el-table-column prop="address" label="地址"> </el-table-column>
      <el-table-column prop="remark" label="备注"> </el-table-column>
      <el-table-column prop="createTime" label="创建时间"> </el-table-column>
      <el-table-column prop="updateTime" label="更新时间"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="form.id ? '编辑' : '新增'" :visible.sync="dialogVisible" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="auto">
        <el-form-item label="客户名" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="行业" prop="industry">
          <el-input v-model="form.industry"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" :rows="2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCustomerList, addCustomer, updateCustomer, deleteCustomer } from '@/api/customer';

export default {
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      form: {},
      rules: {
        name: [{ required: true, message: '请输入客户名', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }]
      }
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      getCustomerList().then(res => {
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
            updateCustomer(this.form).then(() => {
              this.dialogVisible = false;
              this.$message({
                message: '更新成功',
                type: 'success'
              });
              this.getList();
            });
          } else {
            addCustomer(this.form).then(() => {
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
      this.$confirm('确认删除该客户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCustomer(row.id).then(() => {
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.getList();
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.Customer-container {
  padding: 20px;
}
</style>
