const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema
  .virtual("confirmPassword")
  .get(function () {
    return this._confirmPassword;
  })
  .set(function (value) {
    this._confirmPassword = value;
  });

userSchema.pre("validate", function (next) {
  if (this.isNew || this.isModified("password")) {
    if (!this.confirmPassword) {
      this.invalidate("confirmPassword", "Confirm password is required");
    }
    if (this.password !== this.confirmPassword) {
      this.invalidate(
        "confirmPassword",
        "Password must match confirm password"
      );
    }
  }
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

module.exports = mongoose.model("User", userSchema);
