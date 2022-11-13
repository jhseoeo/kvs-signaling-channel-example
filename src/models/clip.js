module.exports = (sequelize, DataTypes) => {
    const Clip = sequelize.define(
        "Clip",
        {
            clipid: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            recordid: {
                type: DataTypes.INTEGER,
                references: {
                    model: "Record",
                    key: "recordid",
                },
            },
            s3path: {
                type: DataTypes.STRING(60),
                allowNull: false,
            },
        },
        {
            charset: "utf8", // 한국어 설정
            collate: "utf8_general_ci", // 한국어 설정
            tableName: "clips", // 테이블 이름
            timestamps: true,
        }
    );

    Clip.associate = function (models) {
        Clip.belongsTo(models.Record, {
            foreignKey: "recordid",
            sourceKey: "recordid",
            onDelete: "cascade",
            onUpdate: "cascade",
        });
    };

    return Clip;
};
