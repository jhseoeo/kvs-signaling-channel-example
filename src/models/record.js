module.exports = (sequelize, DataTypes) => {
    const Record = sequelize.define(
        "Record",
        {
            recordid: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            userid: {
                type: DataTypes.INTEGER,
                onDelete: "cascade",
                references: {
                    model: "users",
                    key: "id",
                },
            },
            record_start: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            record_stop: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            charset: "utf8", // 한국어 설정
            collate: "utf8_general_ci", // 한국어 설정
            tableName: "records", // 테이블 이름
            timestamps: false,
        }
    );

    Record.associate = function (models) {
        Record.belongsTo(models.User, {
            foreignKey: "userid",
            sourceKey: "id",
            onDelete: "cascade",
            onUpdate: "cascade",
        });
        Record.hasMany(models.Clip, {
            foreignKey: "recordid",
            sourceKey: "recordid",
        });
    };

    return Record;
};
