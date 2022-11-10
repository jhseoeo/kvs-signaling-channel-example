const { Sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
    const clip = sequelize.define(
        "clip",
        {
            userid: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                references: {
                    model: "users",
                    key: "id",
                },
            },
            clipid: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            s3path: {
                type: DataTypes.STRING(60),
                allowNull: false,
            },
            recorded_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            charset: "utf8", // 한국어 설정
            collate: "utf8_general_ci", // 한국어 설정
            tableName: "clips", // 테이블 이름
            timestamps: false,
        }
    );

    clip.associate = function (models) {
        clip.belongsTo(models.user, {
            foreignKey: "userid",
            sourceKey: "id",
            onDelete: "cascade",
            onUpdate: "cascade",
        });
    };
};
