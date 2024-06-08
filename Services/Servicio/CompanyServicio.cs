using Domain.Entidades;
using Domain.Util;
using Domain.ViewModels;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Repository.Context;
using Services.IServicio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Domain.ViewModels.CompanyVM;

namespace Services.Servicio
{
    public class CompanyServicio : ICompanyServicio
    {
        private readonly ApplicationDbContext _context;
        public CompanyServicio(ApplicationDbContext context) 
        { 
            _context = context;
        }

        public async Task<Response<List<CompanyView>>> ObtenerListaCompany()
        {
            try
            {
                List<CompanyView> companies = await _context.Company
                    .Select(c => new CompanyView
                    {
                        Id = c.Id,
                        Nombre = c.Nombre
                    })
                    .ToListAsync();

                return new Response<List<CompanyView>>(companies);

            }catch (Exception ex)
            {
                return new Response<List<CompanyView>>(ex.Message);
            }
        }
        public async Task<Response<CompanyView>> ObtenerCompany(int Id)
        {
            try
            {
                Company company = await _context.Company.FirstOrDefaultAsync(x => x.Id == Id);

                if(company == null)
                {
                    throw new Exception("No existe esta Empresa");
                }

                CompanyView view = new()
                {
                    Id = Id,
                    Nombre = company.Nombre
                };

                return new Response<CompanyView>(view);

            }catch (Exception ex)
            {
                return new Response<CompanyView>(ex.Message);
            }
        }
        public async Task<Response<Company>> CrearCompany(CompanyCreate request)
        {
            try
            {
                Company company = new()
                {
                    Nombre = request.Nombre
                };
                _context.Add(company);
                await _context.SaveChangesAsync();

                return new Response<Company>(company, "Registro exitoso.");

            }catch (Exception ex)
            {
                return new Response<Company>(ex.Message);   
            }
        }
        public async Task<Response<Company>> EditarCompany(CompanyCreate request, int Id)
        {
            try
            {
                Company company = await _context.Company.FirstOrDefaultAsync(x => x.Id == Id);

                if (company == null)
                {
                    throw new Exception("No existe esta Empresa");
                }

                company.Nombre = request.Nombre;

                _context.Update(company);
                await _context.SaveChangesAsync();

                return new Response<Company>(company, "Edición con éxito.");

            }catch (Exception ex)
            {
                return new Response<Company>(ex.Message);   
            }
        }
        public async Task<Response<Company>> EliminarCompany(int Id)
        {
            try
            {
                Company company = await _context.Company.FirstOrDefaultAsync(x => x.Id == Id);

                if (company == null)
                {
                    throw new Exception("No existe esta Empresa");
                }
                // Llamar al procedimiento almacenado para eliminar
                await _context.Database.ExecuteSqlRawAsync("EXEC sp_DeleteCompany @CompanyId", new SqlParameter("@CompanyId", Id));

                return new Response<Company>(company, "Eliminación con éxito.");

            }
            catch (Exception ex)
            {
                return new Response<Company>(ex.Message);
            }
        }
    }
}
