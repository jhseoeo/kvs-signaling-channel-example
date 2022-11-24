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
                references: {
                    model: "users",
                    key: "id",
                    onDelete: "cascade",
                    onUpdate: "cascade",
                },
            },
            recordid: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "records",
                    key: "recordid",
                    onDelete: "cascade",
                    onUpdate: "cascade",
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

    return Clip;
};
