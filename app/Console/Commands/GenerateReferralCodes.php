<?php
// app/Console/Commands/GenerateReferralCodes.php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class GenerateReferralCodes extends Command
{
    protected $signature = 'users:generate-referral-codes';
    protected $description = 'Generate referral codes for all existing users who do not have one';

    public function handle()
    {
        $usersWithoutCode = User::whereNull('referral_code')->get();
        $count = $usersWithoutCode->count();

        $this->info("Found {$count} users without referral codes");

        $bar = $this->output->createProgressBar($count);
        $bar->start();

        foreach ($usersWithoutCode as $user) {
            $user->generateReferralCode();
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info("Referral codes generated successfully!");

        return Command::SUCCESS;
    }
}
