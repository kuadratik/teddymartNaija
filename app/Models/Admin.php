<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Admin extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'role',
        'permissions',
        'active'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'password' => 'hashed',
        'permissions' => 'array',
        'active' => 'boolean'
    ];

    /**
     * Query scope to search admin
     */
    public function scopeSearch(Builder $query, $search)
    {
        return $query->when($search)->where(
            fn($q) => $q->where('first_name', 'like', $search)
                ->orWhere('last_name', 'like', $search)
                ->orWhere('email', 'like', $search)
                ->orWhere('role', 'like', $search)
        );
    }

    /**
     * Query scope to scope by role
     */
    public function scopeByRole(Builder $query, $role)
    {
        return $query->when($role)->where('admins.role', $role);
    }

    /**
     * Qeurry scope to get active admins
     */
    public function scopeByActive(Builder $query, $active)
    {
        logger('inside scope');
        return $query->where('admins.active', $active);
    }
}
