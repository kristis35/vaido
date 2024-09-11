using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backas.Migrations
{
    /// <inheritdoc />
    public partial class UpdateVartotojaiWithRelations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Fakultetas",
                table: "Vartotojai");

            migrationBuilder.DropColumn(
                name: "Universitetas",
                table: "Vartotojai");

            migrationBuilder.AddColumn<int>(
                name: "FakultetasId",
                table: "Vartotojai",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "UniversitetasId",
                table: "Vartotojai",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Universitetai",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Pavadinimas = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TrumpasPavadinimas = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Universitetai", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Fakultetai",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Pavadinimas = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TrumpasPavadinimas = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UniversitetasId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Fakultetai", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Fakultetai_Universitetai_UniversitetasId",
                        column: x => x.UniversitetasId,
                        principalTable: "Universitetai",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Vartotojai_FakultetasId",
                table: "Vartotojai",
                column: "FakultetasId");

            migrationBuilder.CreateIndex(
                name: "IX_Vartotojai_UniversitetasId",
                table: "Vartotojai",
                column: "UniversitetasId");

            migrationBuilder.CreateIndex(
                name: "IX_Fakultetai_UniversitetasId",
                table: "Fakultetai",
                column: "UniversitetasId");

            migrationBuilder.AddForeignKey(
                name: "FK_Vartotojai_Fakultetai_FakultetasId",
                table: "Vartotojai",
                column: "FakultetasId",
                principalTable: "Fakultetai",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Vartotojai_Universitetai_UniversitetasId",
                table: "Vartotojai",
                column: "UniversitetasId",
                principalTable: "Universitetai",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Vartotojai_Fakultetai_FakultetasId",
                table: "Vartotojai");

            migrationBuilder.DropForeignKey(
                name: "FK_Vartotojai_Universitetai_UniversitetasId",
                table: "Vartotojai");

            migrationBuilder.DropTable(
                name: "Fakultetai");

            migrationBuilder.DropTable(
                name: "Universitetai");

            migrationBuilder.DropIndex(
                name: "IX_Vartotojai_FakultetasId",
                table: "Vartotojai");

            migrationBuilder.DropIndex(
                name: "IX_Vartotojai_UniversitetasId",
                table: "Vartotojai");

            migrationBuilder.DropColumn(
                name: "FakultetasId",
                table: "Vartotojai");

            migrationBuilder.DropColumn(
                name: "UniversitetasId",
                table: "Vartotojai");

            migrationBuilder.AddColumn<string>(
                name: "Fakultetas",
                table: "Vartotojai",
                type: "varchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Universitetas",
                table: "Vartotojai",
                type: "varchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");
        }
    }
}
