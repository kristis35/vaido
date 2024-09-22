using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backas.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

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

            migrationBuilder.CreateTable(
                name: "Grupes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Pavadinimas = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IlgasPavadinimas = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UniversitetasId = table.Column<int>(type: "int", nullable: false),
                    FakultetasId = table.Column<int>(type: "int", nullable: false),
                    ĮstojimoMetai = table.Column<int>(type: "int", nullable: false),
                    BaigimoMetai = table.Column<int>(type: "int", nullable: false),
                    StudentuSkaicius = table.Column<int>(type: "int", nullable: false),
                    SumoketasAvansas = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ApmokejimoStadija = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    GamybosStadija = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PasleptiGrupe = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Pastabos = table.Column<string>(type: "varchar(1000)", maxLength: 1000, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PatvirtintasSarasas = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    BalsavimasMaketai = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    GrupesSeniunas = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FotografavimoDataVieta = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Grupes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Grupes_Fakultetai_FakultetasId",
                        column: x => x.FakultetasId,
                        principalTable: "Fakultetai",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Grupes_Universitetai_UniversitetasId",
                        column: x => x.UniversitetasId,
                        principalTable: "Universitetai",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Vartotojai",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    PrisijungimoVardas = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Vardas = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Pavarde = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Telefonas = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    VartotojoRole = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Slaptazodis = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UniversitetasId = table.Column<int>(type: "int", nullable: true),
                    FakultetasId = table.Column<int>(type: "int", nullable: true),
                    GrupeId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vartotojai", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Vartotojai_Fakultetai_FakultetasId",
                        column: x => x.FakultetasId,
                        principalTable: "Fakultetai",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Vartotojai_Grupes_GrupeId",
                        column: x => x.GrupeId,
                        principalTable: "Grupes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Vartotojai_Universitetai_UniversitetasId",
                        column: x => x.UniversitetasId,
                        principalTable: "Universitetai",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Fakultetai_UniversitetasId",
                table: "Fakultetai",
                column: "UniversitetasId");

            migrationBuilder.CreateIndex(
                name: "IX_Grupes_FakultetasId",
                table: "Grupes",
                column: "FakultetasId");

            migrationBuilder.CreateIndex(
                name: "IX_Grupes_UniversitetasId",
                table: "Grupes",
                column: "UniversitetasId");

            migrationBuilder.CreateIndex(
                name: "IX_Vartotojai_FakultetasId",
                table: "Vartotojai",
                column: "FakultetasId");

            migrationBuilder.CreateIndex(
                name: "IX_Vartotojai_GrupeId",
                table: "Vartotojai",
                column: "GrupeId");

            migrationBuilder.CreateIndex(
                name: "IX_Vartotojai_UniversitetasId",
                table: "Vartotojai",
                column: "UniversitetasId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Vartotojai");

            migrationBuilder.DropTable(
                name: "Grupes");

            migrationBuilder.DropTable(
                name: "Fakultetai");

            migrationBuilder.DropTable(
                name: "Universitetai");
        }
    }
}
