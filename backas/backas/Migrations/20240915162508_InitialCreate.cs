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
                name: "universitetai",
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
                    table.PrimaryKey("PK_universitetai", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "fakultetai",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Pavadinimas = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TrumpasPavadinimas = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    universitetasId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_fakultetai", x => x.Id);
                    table.ForeignKey(
                        name: "FK_fakultetai_universitetai_universitetasId",
                        column: x => x.universitetasId,
                        principalTable: "universitetai",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "grupes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Pavadinimas = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IlgasPavadinimas = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    universitetasId = table.Column<int>(type: "int", nullable: false),
                    fakultetasId = table.Column<int>(type: "int", nullable: false),
                    ĮstojimoMetai = table.Column<int>(type: "int", nullable: false),
                    BaigimoMetai = table.Column<int>(type: "int", nullable: false),
                    StudentuSkaicius = table.Column<int>(type: "int", nullable: false),
                    SumoketasAvansas = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ApmokejimoStadija = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    GamybosStadija = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Pasleptigrupe = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Pastabos = table.Column<string>(type: "varchar(1000)", maxLength: 1000, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PatvirtintasSarasas = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    BalsavimasMaketai = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    grupesSeniunas = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FotografavimoDataVieta = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_grupes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_grupes_fakultetai_fakultetasId",
                        column: x => x.fakultetasId,
                        principalTable: "fakultetai",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_grupes_universitetai_universitetasId",
                        column: x => x.universitetasId,
                        principalTable: "universitetai",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "vartotojai",
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
                    universitetasId = table.Column<int>(type: "int", nullable: true),
                    fakultetasId = table.Column<int>(type: "int", nullable: true),
                    grupeId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_vartotojai", x => x.Id);
                    table.ForeignKey(
                        name: "FK_vartotojai_fakultetai_fakultetasId",
                        column: x => x.fakultetasId,
                        principalTable: "fakultetai",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_vartotojai_grupes_grupeId",
                        column: x => x.grupeId,
                        principalTable: "grupes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_vartotojai_universitetai_universitetasId",
                        column: x => x.universitetasId,
                        principalTable: "universitetai",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_fakultetai_universitetasId",
                table: "fakultetai",
                column: "universitetasId");

            migrationBuilder.CreateIndex(
                name: "IX_grupes_fakultetasId",
                table: "grupes",
                column: "fakultetasId");

            migrationBuilder.CreateIndex(
                name: "IX_grupes_universitetasId",
                table: "grupes",
                column: "universitetasId");

            migrationBuilder.CreateIndex(
                name: "IX_vartotojai_fakultetasId",
                table: "vartotojai",
                column: "fakultetasId");

            migrationBuilder.CreateIndex(
                name: "IX_vartotojai_grupeId",
                table: "vartotojai",
                column: "grupeId");

            migrationBuilder.CreateIndex(
                name: "IX_vartotojai_universitetasId",
                table: "vartotojai",
                column: "universitetasId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "vartotojai");

            migrationBuilder.DropTable(
                name: "grupes");

            migrationBuilder.DropTable(
                name: "fakultetai");

            migrationBuilder.DropTable(
                name: "universitetai");
        }
    }
}
