module.exports = (sequelize, DataTypes) => {
    const Clip = sequelize.define(
        "Clip",
        {
            clipid: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            userid: {
                type: DataTypes.INTEGER,
                allowNull: false,
                onDelete: "cascade",
                references: {
                    model: "users",
                    key: "id",
                },
            },
            recordid: {
                type: DataTypes.INTEGER,
                allowNull: false,
                onDelete: "cascade",
                references: {
                    model: "records",
                    key: "recordid",
                },
            },
            s3path: {
                type: DataTypes.STRING(60),
                allowNull: false,
            },
            tag: {
                type: DataTypes.STRING(60),
            },
        },
        {
            charset: "utf8", // 한국어 설정
            collate: "utf8_general_ci", // 한국어 설정
            tableName: "clips", // 테이블 이름
            updatedAt: false,
            timestamps: true,
        }
    );

    Clip.associate = function (models) {
        Clip.belongsTo(models.User, {
            foreignKey: "id",
            sourceKey: "userid",
            onDelete: "cascade",
            onUpdate: "cascade",
        });
        Clip.belongsTo(models.Record, {
            foreignKey: "recordid",
            sourceKey: "recordid",
            onDelete: "cascade",
            onUpdate: "cascade",
        });
    };

    return Clip;
};
