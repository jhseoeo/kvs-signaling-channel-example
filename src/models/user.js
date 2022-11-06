module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define(
        "user",
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

    user.associate = function (models) {
        user.hasMany(models.clip, {
            foreignKey: "userid",
            sourceKey: "id",
            onDelete: "cascade",
            onUpdate: "cascade",
        });
    };

    return user;
};
