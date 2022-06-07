<?php declare(strict_types=1);

namespace Tolkam\Routing\Middleware\LastResort\Handler;

use Throwable;
use Tolkam\Application\Extras\Http\Middleware\LastResort\HandlerInterface;
use Tolkam\Routing\Exception;

class RoutingExceptionHandler implements HandlerInterface
{
    /**
     * @inheritDoc
     */
    public function canHandle(Throwable $t): bool
    {
        return $t instanceof Exception;
    }

    /**
     * @inheritDoc
     */
    public function shouldLog(Throwable $t): bool
    {
        return false;
    }

    /**
     * @inheritDoc
     */
    public function getStatusCode(Throwable $t): int
    {
        return match (true) {
            $t instanceof Exception\NotFoundException => 404,
            $t instanceof Exception\NotAllowedException => 405,
            $t instanceof Exception\NotAcceptedException => 406,
        };
    }

    /**
     * @inheritDoc
     */
    public function getReasonPhrase(Throwable $t): ?string
    {
        return null;
    }

    /**
     * @inheritDoc
     */
    public function getHeaders(Throwable $t): ?array
    {
        if ($t instanceof Exception\NotAllowedException) {
            return ['Allow' => implode(', ', $t->getAllowed())];
        }

        return null;
    }
}
