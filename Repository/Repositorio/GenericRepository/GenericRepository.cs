using Microsoft.EntityFrameworkCore;
using Repository.Context;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;

namespace Repository.Repositorio.GenericRepository
{
    public class GenericRepository<TEntity> : IRepository<TEntity> where TEntity : class
    {
        private readonly ApplicationDbContext context;
        private DbSet<TEntity> entities;
        public GenericRepository(ApplicationDbContext context)
        {
            this.context = context;
            entities = context.Set<TEntity>();
        }
        public async Task<int> Crear(TEntity entity)
        {
            await entities.AddAsync(entity);
            var res = await context.SaveChangesAsync();
            return res;
        }

        public async Task<int> Crear(List<TEntity> entity)
        {
            await entities.AddRangeAsync(entity);
            return await context.SaveChangesAsync();
        }
        public async Task<int> Eliminar(int? id)
        {
            var entity = await entities.FindAsync(id);
            entities.Remove(entity);
            return await context.SaveChangesAsync();
        }

        public async Task<int> EliminarMasivo(List<TEntity> entities)
        {
            using (var transaction = context.Database.BeginTransaction())
            {
                var value = 0;
                try
                {
                    this.entities.RemoveRange(entities);
                    value = await context.SaveChangesAsync();
                    transaction.Commit();
                }
                catch (Exception)
                {
                    return value;
                }
                return value;
            }
        }

        public async Task<List<TEntity>> ObtieneLista()
        {
            return await entities.ToListAsync();
        }
        public async Task<List<TEntity>> ObtieneLista(Expression<Func<TEntity, bool>> lambda)
        {
            return await entities.Where(lambda).ToListAsync();
        }

        public async Task<List<TType>> ObtieneLista<TType>(Expression<Func<TEntity, TType>> select) where TType : class
        {
            return await entities.Select(select).ToListAsync();
        }

        public async Task<List<TType>> ObtieneLista<TType>(Expression<Func<TEntity, bool>> lambda, Expression<Func<TEntity, TType>> select) where TType : class
        {
            return await entities.Where(lambda).Select(select).ToListAsync();
        }

        public async Task<List<TEntity>> ObtieneListaDesc<TKey>(Expression<Func<TEntity, bool>> lambda, Expression<Func<TEntity, TKey>> orderByDescending, int registros = 0)
        {
            var query = entities.Where(lambda).OrderByDescending(orderByDescending);

            if (registros > 0)
            {
                return await query.Take(registros).ToListAsync();
            }
            else
            {
                return await query.ToListAsync();
            }
        }

        public async Task<TEntity> BuscarPorId(int? id)
        {
            return await entities.FindAsync(id);
        }

        public async Task<TEntity> BuscarUnElemento(Expression<Func<TEntity, bool>> lambda)
        {
            return await entities.FirstOrDefaultAsync(lambda);
        }
        public async Task<TType> BuscarUnElemento<TType>(Expression<Func<TEntity, bool>> lambda, Expression<Func<TEntity, TType>> select) where TType : class
        {
            return await entities.AsQueryable().Where(lambda).Select(select).FirstOrDefaultAsync();
        }


        public async Task<int> Actualizar(TEntity entity)
        {
            entities.Update(entity);
            return await context.SaveChangesAsync();
        }

        public async Task<int> Actualizar(List<TEntity> entity)
        {
            entities.UpdateRange(entity);
            return await context.SaveChangesAsync();
        }

        public async Task<TEntity> BuscarObjetoNombre(Expression<Func<TEntity, bool>> lambda)
        {
            return await entities.Where(lambda).FirstOrDefaultAsync();
        }
        public async Task<bool> ExisteElemento(Expression<Func<TEntity, bool>> lambda)
        {
            return await entities.AsQueryable().AnyAsync(lambda);
        }

    }
}
