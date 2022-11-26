module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "User",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            userid: {
                type: DataTypes.STRING(20),
                unique: true,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            nickname: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
        },
        {
            charset: "utf8", // 한국어 설정
            collate: "utf8_general_ci", // 한국어 설정
            tableName: "users", // 테이블 이름
            timestamps: false,
        }
    );

    User.associate = function (models) {
        User.hasMany(models.Record, {
            foreignKey: "userid",
            sourceKey: "id",
        });

        User.hasMany(models.Clip, {
            foreignKey: "userid",
            sourceKey: "id",
        });
    };

    return User;
};
