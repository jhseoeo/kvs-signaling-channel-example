// create table member (
//     id SERIAL primary key,
//     userid varchar(20) unique not null,
//     password varchar(20) not null,
//     nickname varchar(20) not null
// );

module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
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
            timestamps: false,
        }
    );
};
